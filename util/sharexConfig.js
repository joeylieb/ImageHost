const TEMPLATE = {
    "Version": "16.0.1",
    "Name": "",
    "DestinationType": "ImageUploader",
    "RequestMethod": "POST",
    "RequestURL": "",
    "Headers": {
        "Authorization": ""
    },
    "Body": "MultipartFormData",
    "FileFormName": "file",
    "URL": "{json:d.url}"
}

const generateShareXConfig = (user) => {
    let userTemplate = TEMPLATE;

    if(!user) return {error: "Cannot generate ShareX config"}

    userTemplate.Name = `${user.selectedDomain} - Images`;
    userTemplate.RequestURL = `https://${user.selectedDomain}/upload/image`;
    userTemplate.Headers.Authorization = user.apiKey;

    return userTemplate;
}

module.exports = {generateShareXConfig};
