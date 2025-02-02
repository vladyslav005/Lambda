import {toPng} from "html-to-image";


export const useExportToImage = () => {

  const handleDownloadPng = async (divRef: any) => {
    if (!divRef.current) return;

    try {
      const pngDataUrl = await toPng(divRef.current, {
        skipFonts: true,
      });

      const link = document.createElement("a");
      link.href = pngDataUrl;
      link.download = "tree.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PNG:", error);
    }
  };


  return {handleDownloadPng};

}