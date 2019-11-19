var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');
var convert = require('xml-js');


const NodeFormat = {
    node: { node: {} },
    char: {chr: {} }
  }
const NodeType = {
    DDFName: { DDFName: 'com.operatorX.dm/1.0/EMail' },
    MIME: {MIME: 'text/plain'}
}
  
class MTNode {
    constructor(){
        this.NodeName='Node Name',
        this.RTProperties= {
            Format: NodeFormat.node,
            Type: NodeType.MIME
        }
    }
}
class MgmtTree {
    constructor(){
        this._attributes = {
            xmln: 'syncml:dmddf1.2'
        },
        this.VerDTD = 1.2,
        this.Node = [new MTNode()]
    }
    addMan(a) {
        this.Man = a
    }
}
//let MTNode2 = JSON.parse(JSON.stringify(MTNode));
let node = new MTNode();
node.NodeName = 'new Node';
node.RTProperties.Format = NodeFormat.char;

let mtree = new MgmtTree();
mtree.addMan(123)
//mtree.Node.push(node)

const json = {
    _declaration:{
        _attributes: {
            version: '1.0',
            encoding: 'utf-8'
        }
    },
    MgmtTree: mtree
    //  {
    //     _attributes: {
    //         xmln: 'syncml:dmddf1.2'
    //     },
    //     VerDTD: 1.2,
    //     Node: [
    //         node
    //     ]
    // }
}

var options = {compact: true, fullTagEmptyElement: false, spaces: 2};
var result = convert.json2xml(json, options);
console.log(result);
// var result = convert.json2xml(json, {compact: false, fullTagEmptyElement: false, spaces: 2});
// console.log('false:',result);

// parseString(xml, function (err, result) {
//     console.log(result.MgmtTree.Node[1]);
// });

// var builder = new xml2js.Builder();
// var xml = builder.buildObject(MgmtTree);
// console.log(xml)

// var xml =
// '<?xml version="1.0" encoding="utf-8"?>' +
// '<MgmtTree>' +
// '<Node>' +
// '    <NodeName>Vendor</NodeName>' +
// '    <RTProperties>...</RTProperties>' +
// '</Node>' +
// '<Node>' +
// '    <NodeName>GWName</NodeName>' +
// '    <Path>Vendor/ISP/GWInfo</Path>' +
// '    <RTProperties>...</RTProperties>' +
//     '<Value>gw.yyy.se</Value>' +
// '</Node>' +
// '</MgmtTree>';