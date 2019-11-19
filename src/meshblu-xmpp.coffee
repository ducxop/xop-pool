_               = require 'lodash'
{EventEmitter2} = require 'eventemitter2'
Client          = require 'node-xmpp-client'
jsontoxml       = require 'jsontoxml'
ltx             = require 'ltx'
uuid            = require 'uuid'
xml2js          = require('xml2js').parseString
fs              = require('fs')

class MeshbluXMPP extends EventEmitter2
  constructor: (options={}) ->
    {@hostname,@port,@uuid,@token, @credentials} = options
    @callbacks = {}

  connect: (callback) =>
    callback = _.once callback
    # myCredentials =
    #             key: fs.readFileSync('E:\\etc\\cert\\self2\\client.b123456.key')
    #             cert: fs.readFileSync('E:\\etc\\cert\\self2\\client.b123456.crt')
    #             ca: fs.readFileSync('E:\\etc\\cert\\self2\\ca.crt')

    #                passphrase: 'optional'

    @connection = new Client
      jid:  "#{@uuid}@192.168.105.231"
      password: @token
      host: @hostname
      port: @port
      credentials: @credentials
      preferred: 'EXTERNAL'
      rejectUnauthorized: false
      requestCert: true

    #      'bosh.url': 'http://localhost:5280/http-bind/'
    @connection.connection.socket.setTimeout(0)
    @connection.connection.socket.setKeepAlive(true, 10000)

    @connection.once 'online', =>
      callback()

    @connection.once 'error', callback
    @connection.on 'error', (error) =>
      @emit 'error', error
    @connection.on 'stanza', @onStanza

  close: =>
    @connection.end()
    delete @connection

  onStanza: (stanza) =>
    #console.log stanza
    if stanza.name == 'message'
      #console.log 'STANZA:', stanza
      @_parseMessage stanza, (error, message) =>
        #console.log 'MES:', message
        return @emit 'message', message
    if stanza.name == 'iq'
      @emit 'iq', stanza
    @callbacks[stanza.attrs.id]?(null, stanza)
    
  message: (message, callback) =>
    request =
      metadata:
        jobType: 'SendMessage'
      rawData: JSON.stringify message

    @_sendRequest request, 'set', callback

  createSessionToken: (toUuid, tags, callback) =>
    metadata =
      toUuid: toUuid

    @_JobSetRequest metadata, tags, 'CreateSessionToken', callback

  register: (opts, callback) =>
    @_JobSetRequest {}, opts, 'RegisterDevice', callback

  searchDevices: (uuid, query={}, callback) =>
    metadata =
      fromUuid: uuid
    @_JobSetRequest metadata, query, 'SearchDevices', callback

  status: (callback) =>
    request =
      metadata:
        jobType: 'GetStatus'

    @_sendRequest request, 'get', callback

  subscribe: (uuid, opts, callback) =>
    metadata =
      toUuid: uuid
    @_JobSetRequest metadata, opts, 'CreateSubscription', callback

  unsubscribe: (uuid, opts, callback) =>
    @subscribe uuid, opts, callback

  update: (uuid, query, callback) =>
    request =
      metadata:
        jobType: 'UpdateDevice'
        toUuid: uuid
      rawData: JSON.stringify query

    @_sendRequest request, 'set', callback

  updateMessageStatus: (uuid, id, status, callback) =>
    query = {id, status}
    request =
      metadata:
        jobType: 'UpdateMessageStatus'
        toUuid: uuid
      rawData: JSON.stringify query

    @_sendRequest request, 'set', callback

  claimOfflineMessages: (uuid, callback) =>
    query = {}
    request =
      metadata:
        jobType: 'ClaimOfflineMessage'
        toUuid: uuid
      rawData: JSON.stringify query

    @_sendRequest request, 'get', callback

  testCR: (uuid_, callback) =>
    query = {}
    responseId = 'cr001' #uuid.v1()

    @callbacks[responseId] = (error, stanza) =>
      delete @callbacks[responseId]
      return callback error if error?
      return @_parseError stanza, callback if stanza.attrs.type == 'error'
      return @_parseResponse stanza, callback

    connectionRequest = ltx.createElement 'connectionRequest', {xmlns: 'urn:broadband-forum-org:cwmp:xmppConnReq-1-0'}
    usernameNode = ltx.parse jsontoxml {username: 'username'}
    passwordNode = ltx.parse jsontoxml {password: 'password'}
    connectionRequest.cnode(usernameNode).up().cnode(passwordNode)

    stanza = new Client.Stanza('iq', to: 'c123456@192.168.105.231/97c65d53937875de45241671b77e57c6', type: 'get', id: responseId)
      .cnode(connectionRequest)

    #console.log stanza
    @connection.send stanza
  testRR: (request) =>
    req = {}
    xml2js request, explicitArray: false, (error, data)=>
      req = data

    stanza = new Client.Stanza('iq', to: req.iq['$'].from, type: 'result', id: 'cr001')
    
    errorNode = ltx.createElement 'error', {type: 'cancel'}
    suNode = ltx.createElement {'service-unavailable', xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas'}
    errorNode.cnode(suNode)
    stanza2 = new Client.Stanza('iq', to: req.iq['$'].from, type: 'error', id: 'cr001')
      .cnode(errorNode)

    connectionRequest = ltx.createElement 'connectionRequest', {xmlns: 'urn:broadband-forum-org:cwmp:xmppConnReq-1-0'}
    usernameNode = ltx.parse jsontoxml {username: 'username'}
    passwordNode = ltx.parse jsontoxml {password: 'password'}
    connectionRequest.cnode(usernameNode).up().cnode(passwordNode)
    errorNode2 = ltx.createElement 'error', {type: 'cancel'}
    naNode = ltx.createElement {'not-authorized', xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas'}
    errorNode2.cnode(naNode)
    stanza3 = new Client.Stanza('iq', to: req.iq['$'].from, type: 'error', id: 'cr001')
      .cnode(connectionRequest).up().cnode(errorNode2)

    console.log 'RES1: ', stanza
    console.log 'RES2: ', stanza2
    console.log 'RES3: ', stanza3
    @connection.send stanza


  whoami: (callback) =>
    request =
      metadata:
        jobType: 'XmppWhoAmI'
        toUuid: @uuid

    @_sendRequest request, 'get', callback

  _JobSetRequest: (metadata, opts, jobType, callback) =>
    request =
      metadata:
        jobType: jobType
      rawData: JSON.stringify opts

    request.metadata = _.merge request.metadata, metadata

    @_sendRequest request, 'set', callback

  _buildStanza: (responseId, type, request) =>
    new Client.Stanza('iq', to: @hostname, type: type, id: responseId)
      .cnode(ltx.parse jsontoxml {request})

  _parseError: (stanza, callback) =>
    error = new Error stanza.getChild('error').getChild('text').getText()
    error.response =  stanza.getChild('error').toString()
    callback error

  _parseResponse: (stanza, callback) =>
    rawData = stanza.getChild('response')?.getChild('rawData')
    return callback null unless rawData?
    callback null, JSON.parse(rawData.getText())

  _sendRequest: (request, type, callback) =>
    return callback new Error('MeshbluXMPP is not connected') unless @connection?

    responseId = uuid.v1()

    @callbacks[responseId] = (error, stanza) =>
      delete @callbacks[responseId]
      return callback error if error?
      return @_parseError stanza, callback if stanza.attrs.type == 'error'
      return @_parseResponse stanza, callback

    @connection.send @_buildStanza(responseId, type, request)

  _parseMessage: (stanza, callback) =>
    options =
      explicitArray: false
      mergeAttrs: true
    #console.log stanza.toString()
    xml2js stanza.toString(), options, (error, data) =>
#      console.log data
      return callback error if error?
      message =
        metadata: data.message?.metadata

      if message.metadata.route?
        unless _.isArray message.metadata.route
          message.metadata.route = [message.metadata.route]

        message.metadata.route = _.map message.metadata.route, (hip) => hip.hop

      if data.message?['rawData']?
        try
          message.data = JSON.parse data.message['rawData']
        catch err
#          console.log data.message['raw-data']
          #console.log '============'
          message.rawData = data.message['rawData']

      callback null, message



module.exports = MeshbluXMPP
