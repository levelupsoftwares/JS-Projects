let playersMove = '';
let computerMove = ''; 
let finalResult = '';


//  let Statuscounter =  {

//       wins : 0,
//       losses: 0,
//       ties : 0
//   };

//              using addEventListener insteed of onclick

 document.querySelector('.js-paper-button')
             .addEventListener('click' , () => {playerGame('paper');})

 const rockEventListener = document.querySelector('.js-rock-button');
            rockEventListener.addEventListener('click' , () => {playerGame('rock');})

  document.querySelector('.js-scissors-button')
            .addEventListener('click' , () => {playerGame('scissors');})

            // addding event listener for keydown
  // when press 'r' player chose an rock 'p' for paper and 's' for scissors
    
  document.body.addEventListener('keydown' ,(event)=> {  //event is an object in which it store which key is pressed that's why we passed in a parameter
    if( event.key === 'r'){
      playerGame('rock');
    }
    else if( event.key === 'p' ){
      playerGame('paper');
    }
    else if(event.key === 's'){
      playerGame('scissors');
    }
  })



let   Statuscounter =  JSON.parse(localStorage.getItem('memory'))||{

wins : 0,
losses: 0,
ties : 0
};

//       if(!Statuscounter){
//  Statuscounter =  

//     }
let isAutoplaying = false;
let intervalId;

function autoplay(){
    if(!isAutoplaying){

/*    intervalId =   setInterval(function(){
             const  autoplayer = computerPick();
               playerGame(autoplayer);
               saveStatus();
           },1000);
*/

    // we know use Arrow Function insteed bcz it recomended when passing a function through an function


         intervalId =   setInterval(() => {  //here i just remove function keyword and put an arrow 
             const  autoplayer = computerPick();
               playerGame(autoplayer);
               saveStatus();
           },1000);

        isAutoplaying = true;
    }
    else{
      clearInterval(intervalId);
      isAutoplaying = false;
    }
}


function computerPick(){
  const randomN = Math.random();
  if(randomN >=0 && randomN < 1/3){
    computerMove = 'rock';
    
  }
  else if(randomN >1/3 && randomN <= 2/3 ){
    computerMove = 'paper';
    
  }    
  else{
    computerMove = 'scissors';
  }
  return computerMove;
}



function playerGame(playerMove){
if(playerMove === 'rock'){
                      playersMove = 'rock';
                      if(computerMove === 'rock'){
                        finalResult = 'Match Tie';
                        Statuscounter.ties +=1 ;

                    }
                    else if(computerMove === 'paper'){
                        finalResult = 'You lose';
                        Statuscounter.losses +=1;
                    }
                    else if(computerMove === 'scissors'){
                        Statuscounter.wins +=1;
                        finalResult = 'You Win';
                    }
}
else if(playerMove === 'paper'){
                  playersMove = 'paper';
                   
                  if(computerMove === 'rock'){
                    finalResult = 'You Win';
                    Statuscounter.wins ++;
                }
                else if(computerMove === 'paper'){
                    finalResult = 'Match Tie';
                    Statuscounter.ties ++;
                }
                else if(computerMove === 'scissors'){
                    finalResult = 'You lose';
                    Statuscounter.losses ++;
                } 

}

else if(playerMove === 'scissors'){
                      playersMove = 'scissors';
                if(computerMove === 'rock'){
                  finalResult = 'You lose';
                  Statuscounter.losses ++;
                  }
                  else if(computerMove === 'paper'){
                      finalResult = 'You Win';
                  Statuscounter.wins ++;
                  }
                  else if(computerMove === 'scissors'){
                  finalResult = 'Match Tie';
                  Statuscounter.ties ++;
                  }
}

computerPick();
saveStatus();

        
}





//function that store the game status in local storage


        //storing in local storage
        function saveStatus(){

          localStorage.setItem('memory',JSON.stringify(Statuscounter));
          updateStatus(); //as pade reload the score update itself without refresh page
        }

//          function resultShower(){

//    alert(` you: ${finalResult}
//    You: ${playerMove} --- Computer: ${computerMove} .  
//    Game Status: Wins:${Statuscounter.wins} Losses:${Statuscounter.losses} Ties:${Statuscounter.ties} `);

//         }




   function updateStatus (){
              //Selecting the para element and put the game status in it
                document.querySelector('.js-result')
                .innerHTML = `${finalResult} `;


                //images changes realtive to the result's 
                document.querySelector('.js-moves')
                .innerHTML = ` You: <img  src ="images/${playersMove}-emoji.png" class="result-moves">
                <img src="images/${computerMove}-emoji.png" class="result-moves" > Computer`;

                document.querySelector('.js-p-status')
                .innerHTML = ` Game Status: Wins:${Statuscounter.wins} Losses:${Statuscounter.losses} Ties:${Statuscounter.ties} ` ;

   }