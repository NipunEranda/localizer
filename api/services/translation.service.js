const translate = require('@iamtraction/google-translate');

async function translateTextAll(list, from, to) {
    let translations = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i].text) {
            const response = await translate(list[i].text, { from: from, to: to });
            if (response) {
                translations.push({
                    id: list[i].id,
                    original: list[i].text,
                    translated: response.text,
                    autoCorrected: response.from.text.autoCorrected,
                    didYouMean: response.from.text.didYouMean ? response.from.text.didYouMean : null
                });
            }
        }
    }
    return translations;
}

async function translateText(text, from, to) {
    const response = await translate(text, { from: from, to: to });
    return {
        original: text,
        translated: response.text,
        autoCorrected: response.from.text.autoCorrected,
        didYouMean: response.from.text.didYouMean ? response.from.text.didYouMean : null
    }
}

module.exports = {
    translateTextAll,
    translateText
}