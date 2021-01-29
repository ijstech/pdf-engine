const Pdfmaker = require('pdfmake');
const Storage = require('@ijstech/storage');
const Uuid = require('uuid');

const DefaultFonts = {
    Roboto: {
      normal: __dirname + '/fonts/Roboto-Regular.ttf',
      bold: __dirname + '/fonts/Roboto-Medium.ttf',
      italics: __dirname + '/fonts/Roboto-Italic.ttf',
      bolditalics: __dirname + '/fonts/Roboto-MediumItalic.ttf'
    }
};

function createFile(content, options){

}
function createPdf(pdfDoc, options) {	
    options = options || {}
	return new Promise(function(resolve, reject){        
		fonts = options.fonts || DefaultFonts
		var printer = new Pdfmaker(fonts);
		var doc = printer.createPdfKitDocument(pdfDoc);
		var chunks = [];
		var result;
		doc.on('data', function (chunk) {
			chunks.push(chunk);
		});
		doc.on('end', function () {
			result = Buffer.concat(chunks);
			resolve(result);
		});
		doc.end();
	})	
}
module.exports = {
    _init: function(options){
        this.options = options;
    },
    _plugin: function(vm, ctx, site, options){                
        vm.injectGlobalObject('_$$plugin_pdf_engine', {
            $$createFile: true,
            createFile: async function(pdfDoc, options){                
                options = options || {};
                let buffer = await createPdf(pdfDoc, options);                
                let guid = Uuid.v4();
                let filePath = site.org.guid + '/' + guid;
                await Storage.writeFile(filePath, buffer)                
                return JSON.stringify({
                    guid: guid,
                    fileName: options.name || 'file.pdf',
                    size: buffer.length
                });
            }
        }, ''+ function init(){
            global.Plugins.PdfEngine = {
                createFile: async function(pdfDoc, options){
                    let result =_$$plugin_pdf_engine.createFile(pdfDoc, options);                    
                    return JSON.parse(result)
                }
            }
        } + ';init()')
    }
}