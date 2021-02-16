declare module Plugins.PdfEngine{
	interface IPdfFile {
		guid: string,
		size: number
	}
	interface IPdfOptions {
		fonts: any
	}
    export function createFile(pdfDoc: any, options?: IPdfOptions): IPdfFile;
    export function createDataUri(pdfDoc: any, options?: IPdfOptions): string;
}