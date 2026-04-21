

const userMaster = document.getElementById('loginForm');

userMaster.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const res = await fetch('http://127.0.0.1:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        if (res.ok) {
            window.location.href = '/html/dashboard/dashboard.html';
        } else {
            const errorText = await res.text();
            alert(errorText || 'Login failed');
        }
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        alert('Login request failed');
    }
});

//!     Testing functions - to be removed
// async function checkUser() {
//     const res = await fetch('http://127.0.0.1:3000/check-user', {
//         method: 'GET',
//         credentials: 'include'
//     });

//     const data = await res.json();
//     console.log('CHECK USER DATA:', data);
//     alert(JSON.stringify(data));
// }

//
// async function checkAdmin() {
//     const res = await fetch('http://127.0.0.1:3000/admin', {
//         method: 'GET',
//         credentials: 'include'
//     });

//     const text = await res.text();

//     console.log('ADMIN STATUS:', res.status);
//     console.log('ADMIN RESPONSE:', text);

//     alert(`ADMIN STATUS: ${res.status}\nADMIN RESPONSE: ${text}`);
// }


//!   Old code - to be removed
// userMaster.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     try {
//         const res = await fetch('http://127.0.0.1:3000/auth/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include',
//             body: JSON.stringify({
//                 email: email.value,
//                 password: password.value
//             })
//         });

//         if (res.ok) {
//             //LOG
//             alert('Login successful');

//             await checkUser();
//             await checkAdmin();

//         } else {
//             const errorText = await res.text();
//             // LOG
//             console.log('LOGIN FAILED:', errorText);

//             alert('Login failed');
//         }
//     } catch (error) {
//         console.error('LOGIN ERROR:', error);
//         alert('Login request error');
//     }
// });

// const userMaster = document.getElementById('loginForm');

// userMaster.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const res = await fetch('http://127.0.0.1:3000/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//             email: email.value,
//             password: password.value
//         })
//     });

//     if (res.ok) {
//         // window.location.href = 'http://localhost:3000/admin'; // Redirect to admin dashboard

//         alert('Login successful');

//     } else {
//         alert('Login failed');
//     }

// });


