function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function extractFileType(filename) {
    const lastIndex = filename.lastIndexOf('.');

    if (lastIndex === -1 || lastIndex === filename.length - 1) {
        return '';
    }

    return filename.substring(lastIndex + 1).toLowerCase();
}

function singularize(word) {
    const irregularPlurals = {
        "videos": "video",
        "images": "image"
    };

    if (irregularPlurals.hasOwnProperty(word)) {
        return irregularPlurals[word];
    }

    if (word.endsWith("s")) {
        return word.slice(0, -1);
    }

    return word;
}


module.exports = {generateRandomID, extractFileType, singularize}
