
  document.querySelector('.js-add')
              .addEventListener('click' , () => {addto();});


  document.body
              .addEventListener('Enter', (event) => {console.log('hi');});

  
           
                   
                   
                
            

        const todoList = JSON.parse( localStorage.getItem('savedTodo')) || [{
            name:"temp-todo",
            dueDate:"2025-26-09"
         }];

     render();

 function render(){
     let todoListHTML ='';

     todoList.forEach((todoObject,i) => {  //here we used forEach preffred method for array through loop
        const  {name , dueDate} = todoObject; //shortcut for destructor

        let html = `
                   <div>
                      ${name}
                   </div>
                   
                   <div>
                      ${dueDate}
                    </div>

                   <button class ="css-delete js-delete-todo" 
                            
                         >Delete</button>
                    
                    
                   ` 
                    

        todoListHTML += html;
        

     });
       
    //  for(let i = 0; i < todoList.length; i++){

    //          const todoObject = todoList[i];

    //         // const name = todoObject.name;
    //        //  const dueDate = todoObject.duedate;
     
    //      }
             
         document.querySelector('.js-div')
            .innerHTML = todoListHTML;

            document.querySelectorAll('.js-delete-todo')
                .forEach((deleteButton, index) => {
                   deleteButton.addEventListener('click' , ()=>{
                                deleteFromtodo(index);
                                
                                
                   })
                });

            saveToStorage();
             
 }



     function addto(){

         const inputElement = document.querySelector('.js-name-input');
         const name = inputElement.value;
         const dueDateElem = document.querySelector('.js-input-date');
         const dueDate = dueDateElem.value;

         todoList.push({
             //name : todoObject.name,
             //dueDate : todoObject.duedate
             name,
             dueDate
         });

         

         inputElement.value = '';
         dueDateElem.value = '';

         render();
         //saved in local storage
         saveToStorage();
     }

     function deleteFromtodo(index){
         todoList.splice(index , 1);
         console.log('hiii');
         render();
     }

     function saveToStorage(){
         localStorage.setItem('savedTodo',JSON.stringify(todoList));
     }