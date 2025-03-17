import html2canvas from 'html2canvas';

type DivRef = React.MutableRefObject<HTMLDivElement | null>;

export const useExportToImage = () => {
  const handleDownloadPng = async (divRef: DivRef) => {
    if (!divRef.current) {
      console.error("Div reference is not available.");
      return;
    }

    try {
      const canvas = await html2canvas(divRef.current, {
        useCORS: true,
        logging: true,
      });

      const pngDataUrl = canvas.toDataURL('image/png');

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

  return { handleDownloadPng };
};