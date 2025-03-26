const diacritics = require('diacritics');



const cleanText = async (input:string) => {
    const cleanedText = input.replace(/[^\w\s]/gi, ''); // Elimina caracteres especiales excepto letras y espacios
    const normalizedText = diacritics.remove(cleanedText); // Normaliza los caracteres acentuados
    return normalizedText.toLowerCase(); // Convierte el texto a minúsculas
};

const generateRegex = (word:string) => {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapa caracteres especiales en la palabra
    const regexString = escapedWord.split('').join('.*'); // Crea un regex que coincide con cualquier cantidad de caracteres entre cada letra de la palabra
    return new RegExp(regexString, 'i'); // La 'i' al final hace que la búsqueda sea insensible a mayúsculas y minúsculas
  };

export { cleanText, generateRegex };
