export const truncateToNWords = (text: string, n: number) => {
  return text.split(' ').slice(0, n).join(' ');
};

export const extractTeleGramChatId = (url: string) => {
    const regex = /^https:\/\/web\.telegram\.org\/a\/#(-?\d+)$/;
    const match = url.match(regex);

    if (match) {
      return { status: true, chatId: match[1] }; // Return the chat ID
    } else {
      return { status: false }; // Return false if the format is incorrect
    }
  };

  export const isValidTweetUrl = (url: string) => {
    const tweetUrlPattern =
      /^https?:\/\/(www\.)?(twitter|x)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/i;

    const match = url.match(tweetUrlPattern);

    if (match) {
      const tweetId = match[5]; // Extracting the tweet ID from the matched groups
      return {
        isValid: true,
        tweetId: tweetId,
      };
    } else {
      return {
        isValid: false,
        tweetId: null,
      };
    }
  };


  export const getAcceptedFileTypes = (uploadFileType: string | any) => {
    switch (uploadFileType) {
      case "image":
        return "image/jpeg,image/png,image/gif";
      case "audio":
        return "audio/mpeg,audio/wav";
      case "video":
        return "video/mp4,video/quicktime";
      case "document":
        return ".pdf,.doc,.docx,.txt";
      case "spreadsheet":
        return ".xlsx,.csv";
      case "code":
        return ".js,.py,.html";
      case "3d":
        return ".obj,.fbx";
      case "archive":
        return ".zip,.rar";
      default:
        return "";
    }
  };

    // validation for file upload
 export const getFileTypeInfo = (uploadFileType: any) => {
    switch (uploadFileType) {
      case "image":
        return ".jpg, .png, .gif";
      case "audio":
        return ".mp3, .wav";
      case "video":
        return ".mp4, .mov";
      case "document":
        return ".pdf, .doc, .txt";
      case "spreadsheet":
        return ".xlsx, .csv";
      case "code":
        return ".js, .py, .html";
      case "3d":
        return ".obj, .fbx";
      case "archive":
        return ".zip, .rar";
      default:
        return "";
    }
  };

 export const validateFileType = (file: any, uploadFileType: string | any) => {
    const acceptedTypes = getAcceptedFileTypes(uploadFileType).split(",");
    return acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type);
      } else {
        return file.type === type;
      }
    });
  };