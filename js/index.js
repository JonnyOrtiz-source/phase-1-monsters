'use strict';

(function () {
   // VARIABLES
   const BASE_URL = 'http://localhost:3000';
   let myLimit = 50;
   let myPage = 1;
   let maxMonsters = 0;

   // DOM ELEMENTS
   const newMonsterContainer = document.getElementById('create-monster');
   const monstersContainer = document.getElementById('monster-container');
   const btnBack = document.getElementById('back');
   const btnForward = document.getElementById('forward');

   // FUNCTIONS
   const postMonster = async (monsterObj) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify({
         name: monsterObj.name,
         age: monsterObj.age,
         description: monsterObj.description,
      });
      const requestOptions = {
         method: 'POST',
         headers: myHeaders,
         body: raw,
      };

      try {
         const response = await fetch(`${BASE_URL}/monsters`, requestOptions);
         if (!response.ok) {
            throw new Error(
               `Problem posting new monster: ${response.status} ${response.statusText}`
            );
         }
      } catch (err) {
         alert(`There was a problem adding the new monster. ${err}`);
      }
   };

   const renderMonster = (monsterObj) => {
      const h2MonsterName = document.createElement('h2');
      const h4MonsterAge = document.createElement('h4');
      const pMonsterDesc = document.createElement('p');

      h2MonsterName.textContent = monsterObj.name;
      h4MonsterAge.textContent = `Age: ${monsterObj.age}`;
      pMonsterDesc.textContent = `Bio: ${monsterObj.description}`;

      monstersContainer.append(h2MonsterName, h4MonsterAge, pMonsterDesc);
   };

   const getMonsters = async (page) => {
      try {
         const response = await fetch(
            `${BASE_URL}/monsters/?_limit=${myLimit}&_page=${page}`
         );
         if (response.ok) {
            const returnedArr = await response.json();

            maxMonsters = returnedArr.length;

            if (myPage >= 1) {
               monstersContainer.innerHTML = '';
            }

            returnedArr.forEach((monsterObj) => {
               renderMonster(monsterObj);
            });
         } else {
            throw new Error(
               `Problem getting monsters: ${response.status} ${response.statusText} `
            );
         }
      } catch (err) {
         alert(err);
      }
   };

   const createForm = () => {
      const form = document.createElement('form');
      const inputMonsterName = document.createElement('input');
      const inputMonsterAge = document.createElement('input');
      const inputMonsterDesc = document.createElement('input');
      const btnCreateMonster = document.createElement('button');

      form.id = 'form';
      inputMonsterName.name = 'name';
      inputMonsterName['aria-describedby'] = 'Monster Name';
      inputMonsterName.placeholder = 'name...';
      inputMonsterAge.name = 'age';
      inputMonsterAge.placeholder = 'age...';
      inputMonsterAge['aria-describedby'] = 'Monster Age';
      inputMonsterDesc.name = 'description';
      inputMonsterDesc.placeholder = 'desc...';
      inputMonsterDesc['aria-describedby'] = 'Monster Description';
      btnCreateMonster.textContent = 'Create';
      btnCreateMonster.id = 'formButton';

      form.append(
         inputMonsterName,
         inputMonsterAge,
         inputMonsterDesc,
         btnCreateMonster
      );

      newMonsterContainer.append(form);

      return form;
   };

   const initialize = () => {
      getMonsters(myPage);
   };

   // HANDLERS
   const handleFormSubmit = (e) => {
      const newMonsterEntry = Object.fromEntries(
         new FormData(e.target).entries()
      );

      renderMonster(newMonsterEntry);
      postMonster(newMonsterEntry);
   };

   const handleBack = (e) => {
      myPage -= 1;
      myPage >= 1 ? getMonsters(myPage) : (myPage = 1);
   };

   const handleForward = (e) => {
      myPage += 1;
      myPage <= maxMonsters ? getMonsters(myPage) : (myPage -= 1);
   };

   // EVENTS
   createForm().addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(e);
      e.target.reset();
   });

   btnBack.addEventListener('click', (e) => {
      e.preventDefault();
      handleBack(e);
   });

   btnForward.addEventListener('click', (e) => {
      e.preventDefault();
      handleForward(e);
   });

   initialize();
})();
