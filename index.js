const login = () => {

    const hash_senha = 'b7e94be513e96e8c45cd23d162275e5a12ebde9100a425c4ebcdd7fa4dcd897c'

    const senha = document.getElementById('senha').value

    if (hash_senha === hex_sha256(senha)) {
        sessionStorage.setItem('logado', 'sim')
        window.location = 'main.html'

    } else {
        alert("Senha incorreta")

    }
}