process.stdin.on('data', (e) => {
  const playerAction = e.toString().trim();
  console.log(playerAction);
});
