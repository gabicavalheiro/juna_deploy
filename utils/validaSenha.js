export default function validaSenha(senha) {
    const mensagem = [];

    if (senha.length < 8) {
        mensagem.push("Erro... senha deve possuir, no mínimo, 8 caracteres");
    }

    let pequenas = 0;
    let grandes = 0;
    let numeros = 0;
    let simbolos = 0;

    for (const letra of senha) {
        if ((/[a-z]/).test(letra)) {
            pequenas++;
        } else if ((/[A-Z]/).test(letra)) {
            grandes++;
        } else if ((/[0-9]/).test(letra)) {
            numeros++;
        } else {
            simbolos++;
        }
    }

    if (pequenas === 0 || grandes === 0 || numeros === 0 || simbolos === 0) {
        mensagem.push("Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos");
    }

    return mensagem;
}
