const socket = io('http://localhost:2000')
const scoreCounter = document.getElementById('score')
const board = document.getElementById('board')

socket.on('connect', () => {
console.log('Connection Established')
});

socket.on('updateCounter', (data) => {
    scoreCounter.innerText = 'Ваш счёт: ' + data.newScore
})

socket.on('updateBoard', (data) => {
    let boardShowText = 'Other people score:'
    data.forEach(element => {
        boardShowText += '\n' + JSON.stringify(element.playerScore)
    });
    console.log(data)
})

document.getElementById('scoreButton').addEventListener('click', () => {
    socket.emit('updateCounter');
});