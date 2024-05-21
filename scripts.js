const password = '@Yopi1207'; // Ganti dengan kata sandi yang Anda inginkan

function checkPassword() {
  const passwordInput = document.getElementById('password').value;

  if (passwordInput === password) {
    document.getElementById('passwordPrompt').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
  } else {
    alert('Wrong password. Please try again.');
  }
}

document.getElementById('addForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const userData = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password')
  };

  try {
    // Kirim permintaan untuk menambahkan pengguna baru
    const userResponse = await axios.post('https://panelss.loviecho.biz.id/auth/register', userData);
    const userId = userResponse.data.attributes.id;

    // Kirim permintaan untuk menambahkan server baru
    const serverData = {
      name: formData.get('serverName'),
      egg: formData.get('eggId'),
      docker_image: formData.get('dockerImage')
    };

    const serverResponse = await axios.post('https://panelss.loviecho.biz.id/application/servers', serverData);
    const serverId = serverResponse.data.attributes.id;

    // Berikan akses admin kepada pengguna untuk server yang baru dibuat
    const addServerUserResponse = await axios.post(`https://panelss.loviecho.biz.id/application/servers/${serverId}/users`, {
      permissions: 'admin',
      user: userId
    });

    showMessage('User and Server added successfully!');
  } catch (error) {
    console.error('Error:', error.response.data);
    showMessage('Error adding User and Server. Please try again.', 'error');
  }
});

function showMessage(message, type = 'success') {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.className = type;
}
