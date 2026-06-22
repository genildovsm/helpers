# Alguns exemplos de Replace com Regex

O método `.replace()` do JavaScript, quando combinado com **Expressões Regulares (Regex)**, permite localizar padrões complexos de texto dentro de uma string e substituí-los de forma dinâmica.

A sintaxe básica é: `string.replace(regex, substituto).`

### Flags Essenciais

~~~javascript
const texto = "Gato, cão, GATO, passarinho.";

// Sem a flag /g, apenas o primeiro muda
console.log(texto.replace(/Gato/, "Leão")); 
// Saída: "Leão, cão, GATO, passarinho."

// Com as flags /g e /i, substitui todos independente da caixa
console.log(texto.replace(/Gato/gi, "Leão")); 
// Saída: "Leão, cão, Leão, passarinho."
~~~

### Substituição Dinâmica com Grupos de Captura ($1, $2)

~~~javascript
// Exemplo: Formatando um telefone bruto
const telefoneBruto = "11988887777";
const regexTel = /(\d{2})(\d{5})(\d{4})/;

// $1 pega o primeiro grupo (\d{2}), $2 o segundo, e assim por diante
const telefoneFormatado = telefoneBruto.replace(regexTel, "($1) $2-$3");
console.log(telefoneFormatado); 
// Saída: "(11) 98888-7777"
~~~

### Substituição Avançada com Funções de Callback

~~~javascript
// Exemplo: Dobrar todos os números encontrados no texto
const frase = "Comprei 2 maçãs e 5 bananas.";
const regexNumeros = /\d+/g;

const fraseModificada = frase.replace(regexNumeros, (match) => {
    // 'match' é o texto encontrado. Convertemos para número e dobramos.
    return Number(match) * 2;
});

console.log(fraseModificada); 
// Saída: "Comprei 4 maçãs e 10 bananas."
~~~

### Limpar caracteres não numéricos (Sanitização)

~~~javascript
const cpfComPontos = "123.456.789-00";
// O símbolo [^\d] significa "tudo que NÃO for dígito"
const apenasNumeros = cpfComPontos.replace(/[^\d]/g, "");
console.log(apenasNumeros); // "12345678900"
~~~

### Remover espaços extras

~~~javascript
const textoSujo = "  Olá     mundo   com   espaços  ";
// \s+ localiza um ou mais espaços em branco seguidos
const textoLimpo = textoSujo.replace(/\s+/g, " ").trim();
console.log(textoLimpo); // "Olá mundo com espaços"
~~~
