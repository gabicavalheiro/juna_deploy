const enviarDados = async () => {
    const dados = {
      nome: "Joao",
      email: "joao@gmail.com",
      senha: "jao",
      admin: false
    };
  
    try {
      const response = await fetch('https://junadeploy-production.up.railway.app/administradores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Resposta do servidor:', responseData);
      } else {
        console.error('Erro na requisição:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };
  
  enviarDados();
  