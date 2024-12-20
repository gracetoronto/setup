// High prio
   // wireless mics
   // need to check if item exists in location
   // finish always
   // on channel instrument field change
   // equipment per musician
   // substitute
      // wireless mics
      // passive DI -> active DI -> stereo DI
      // stereo DI -> passive DI x2 -> passive DI, active DI -> active DI x2
      // XLR -> XLR (Long)
      // XLR (Long) -> XLR x2
   // add cables for macbook audio
   // channel quantity

// Low prio
   // max channels
   // alert (changes made, submit again)
   // add channel
   // clarify USB names


// elements
const rolesTable = document.getElementById('roles-table').getElementsByTagName('tbody')[0];


// global variables
let selection = [];
let channels = 0;
let equipment = {};

function createInstrumentOptions(instruments) {
   const optionElements = instruments.map(instr => `<option value="${instr.name}">${instr.label}</option>`);
   return optionElements.join('');
}

function addRow() {
   const newRow = rolesTable.insertRow();

   newRow.innerHTML = `
      <td class="cell-lg cell-center">
         <input type="text" name="name[]" placeholder="Enter Name" style="width: 100%;" maxlength="20">
      </td>
      <td class="cell-md cell-center">
         <input type="checkbox" name="singing[]" value="yes" checked disabled>
      </td>
      <td class="cell-md cell-center">
         <select name="instrument[]" onchange="handleInstrumentChange(this)">
            ${createInstrumentOptions(instruments)}
         </select>
      </td>
      <td class="cell-sm cell-center">
         <input type="checkbox" name="bringing[]" value="yes" disabled>
      </td>
      <td class="cell-sm cell-center">
         <input type="checkbox" name="stereo[]" value="yes" disabled>
      </td>
      <td class="cell-sm cell-center">
         <select name="position[]">
            <option value="near">Near</option>
            <option value="far">Far</option>
         </select>
      </td>
      <td class="cell-actions-sm cell-center">
         <button type="button" onclick="moveRowUp(this)">&uarr;</button>
         <button type="button" onclick="moveRowDown(this)">&darr;</button>
         <button type="button" onclick="removeRow(this)">–</button>
      </td>
   `;
}

function removeRow(button) {
   const row = button.closest('tr');
   const tbody = button.closest('tbody');

   row.remove();

   if (button.classList.contains('channel-controls')) {
      numberChannels(tbody);
      listChannels(tbody);
   }

}

function moveRowUp(button) {
   const row = button.closest('tr');
   const tbody = button.closest('tbody');
   const previousRow = row.previousElementSibling;

   if (previousRow) {
      row.parentNode.insertBefore(row, previousRow);

      if (button.classList.contains('channel-controls')) {
         numberChannels(tbody);
         listChannels(tbody);
      }
   }
}

function moveRowDown(button) {
   const row = button.closest('tr');
   const tbody = button.closest('tbody');
   const nextRow = row.nextElementSibling;

   if (nextRow) {
      row.parentNode.insertBefore(nextRow, row);

      if (button.classList.contains('channel-controls')) {
         numberChannels(tbody);
         listChannels(tbody);
      }
   }
}

function handleLabelClick(e) {
   const fieldset = e.currentTarget.closest('fieldset');
   const checkbox = fieldset.querySelector('input[type="checkbox"]');
   checkbox.checked = !checkbox.checked;
}
const labels = Array.from(document.querySelectorAll('input[type="checkbox"] + label'));
labels.forEach(label => {
   label.addEventListener('click', handleLabelClick);
});


function handleInstrumentChange(select) {
   const row = select.closest('tr');
   const singing = row.querySelector('input[name="singing[]"]');
   const bringing = row.querySelector('input[name="bringing[]"]');
   const stereo = row.querySelector('input[name="stereo[]"]');

   const constraints = instruments.find(instr => instr.name === select.value).constraints;

   singing.checked = constraints.singing.checked;
   singing.disabled = constraints.singing.disabled;

   bringing.checked = constraints.bringing.checked;
   bringing.disabled = constraints.bringing.disabled;

   stereo.checked = constraints.stereo.checked;
   stereo.disabled = constraints.stereo.disabled;
}

function updateSelection(rolesTable) {
   const rows = Array.from(rolesTable.querySelectorAll('tr'));
   return rows.map(row => {
      return {
         name: row.querySelector('input[name="name[]"]').value,
         instrument: row.querySelector('select[name="instrument[]"]').value,
         singing: row.querySelector('input[name="singing[]"]').checked,
         bringing: row.querySelector('input[name="bringing[]"]').checked,
         stereo: row.querySelector('input[name="stereo[]"]').checked,
         position: row.querySelector('select[name="position[]"]').value
      }
   });
}

function resetEquipment(equipment) {

   channels = 0;
   equipment = {};

   return [channels, equipment];
}

function getEquipmentDiff(obj1, obj2) {
   
   const differences = {};
   let difference;

   for (const key in obj1) {
      if (Object.prototype.hasOwnProperty.call(obj2, key) && typeof obj1[key] === 'number' && typeof obj2[key] === 'number') {
         difference = obj1[key] - obj2[key];
      } else {
         difference = obj1[key];
      }

      if (difference > 0) {
         differences[key] = difference;
      }
   }

   return differences;
}

function addEquipment(channels, equipment, equip, name, instrument) {

   const equipmentBefore = { ...equipment };
   const channelsBefore = channels;

   [channels, equipment] = equip(channels, equipment);

   const log = { equipment: getEquipmentDiff(equipment, equipmentBefore), channels: channels - channelsBefore };
   if (instrument) { log.name = name; log.instrument = instrument; }
   console.log(log);

   return [channels, equipment];
}

function calcEquipment(equipAlways, selection, instruments, channels, equipment) {

   // always add this equipment
   console.log("Always:");
   [channels, equipment] = addEquipment(channels, equipment, equipAlways);

   console.log("Musicians:");
   selection.forEach(musician => {

      const instrument = instruments.find(instr => instr.name === musician.instrument);

      [channels, equipment] = addEquipment(channels, equipment, (channels, equipment) => {

         [channels, equipment] = instrument.equip({
            singing: musician.singing,
            bringing: musician.bringing,
            stereo: musician.stereo,
            position: musician.position
         }, channels, equipment);

         return [channels, equipment];

      }, musician.name, musician.instrument);
   });

   // remove properties that equal 0
   for (const key in equipment) {
      if (equipment[key] === 0) {
         delete equipment[key];
      }
   }

   console.log("Channels:");
   console.log(channels);

   console.log("Equipment:");
   console.log(equipment);

   return [channels, equipment];
}

function sourceEquipment(equipment, locations) {

   const locs = {...locations};
   const eq = {...equipment};
   const needs = {};

   // for each location
   for (let [locName, locInventory] in locs) {

      needs[locName] = {};
      
      // for each piece of equipment
      for (let [eqItem, eqQty] in eq) {
         
         // only if needed
         if (eqQty && eqQty > 0) {

            if (locInventory[eqItem]) {

               const diff = locInventory[eqItem] - eqQty;
            
               if (diff > 0) {
                  
                  // need equipment from this location
                  needs[locName][eqItem] = eqQty;
   
                  // don't need any more equipment
                  eq[eqItem] = 0;
   
                  // remaining quantity of equipment at location
                  locs[locName][eqItem] = diff;
   
               } else if (diff === 0) {
   
                  // need equipment from this location
                  needs[locName][eqItem] = eqQty;
   
                  // don't need any more equipment
                  eq[eqItem] = 0;
   
                  // no more equipment at location
                  locs[locName][eqItem] = 0;
   
               } else if (diff < 0) {
   
                  // need equipment from this location
                  needs[locName][eqItem] = locs[locName][eqItem];
   
                  // need more equipment still
                  eq[eqItem] = -diff;
   
                  // no more equipment at location
                  locs[locName][eqItem] = 0;
               }
            }
         }
      }

      // go through locations again and substitute items

      console.log('Needs:');
      console.log(needs);
   }
}

function resetTBody(tbody) {
   tbody.innerHTML = "";
}

function numberChannels(tbody) {
   const rowNodes = Array.from(tbody.querySelectorAll('tr>td.cell-sm'));
   rowNodes.forEach((node, index) => {
      node.innerText = `${index + 1}.`;
   });
}

function listChannels(tbody) {

   const section = tbody.closest('section');

   // remove any existing list
   let existingListHeading = section.querySelector('h3');
   if (existingListHeading) { existingListHeading.remove(); }
   let existingList = section.querySelector('ol');
   if (existingList) { existingList.remove(); }

   // create <li> elements from rows
   const populatedRows = Array.from(tbody.querySelectorAll('tr'));

   const listElements = populatedRows.map(row => {
      return `
            <li>${row.querySelector('td>input').value}</li>
         `;
   });

   // create <ol> from array
   const newList = `
         <h3>Channels List</h3>
         <ol id="channels-list">
            ${listElements.join("")}
         </ol>
      `;

   // append <ol> to channels-section
   section.innerHTML += newList;

   return newList;
}

function populateChannels(selection, tbody) {

   const cellActions = `
      <td class="cell-actions-sm">
         <button class="channel-controls" type="button" onclick="moveRowUp(this)">&uarr;</button>
         <button class="channel-controls" type="button" onclick="moveRowDown(this)">&darr;</button>
         <button class="channel-controls" type="button" onclick="removeRow(this)">&ndash;</button>
      </td>
   `;

   let channelCounter = 1;
   let rowElements = selection.map((musician) => {

      let instrumentLabel = instruments.find(instr => instr.name === musician.instrument).label;

      if (instrumentLabel === "None") {
         instrumentLabel = "Mic";
      }

      let rowCode = `
         <tr class="instr-${musician.instrument} position-${musician.position} ${musician.stereo ? `stereo` : ``}">
            <td class="cell-sm">
            </td>
            <td class="cell-lg">
               <input type="text" value="${instrumentLabel}${musician.stereo ? ` L` : ``}${musician.name ? ` (${musician.name})` : ``}">
            </td>
            ${cellActions}
         </tr>
         ${musician.stereo ? `
            <!-- split -->
            <tr class="instr-${musician.instrument} position-${musician.position} ${musician.stereo ? `stereo` : ``}">
               <td class="cell-sm">
               </td>
               <td class="cell-lg">
                  <input type="text" value="${instrumentLabel} R${musician.name ? ` (${musician.name})` : ``}">
               </td>
               ${cellActions}
            </tr>
         ` : ``}
      `;

      channelCounter++;

      if (musician.stereo) {
         channelCounter++;
      }

      if (musician.singing && musician.instrument !== "none" && musician.instrument !== "speaker") {
         rowCode += `
            <!-- split -->
            <tr class="instr-none position-${musician.position}">
               <td class="cell-sm">
               </td>
               <td class="cell-lg">
                  <input type="text" value="Mic${musician.name ? ` (${musician.name})` : ``}">
               </td>
               ${cellActions}
            </tr>
         `;
      }

      return rowCode;
   });

   // split rows properly
   rowElements = rowElements.join('<!-- split -->').split('<!-- split -->');

   // rearrange rows
   const rearrangedRows = [];

   // find last far stereo instrument
   let lastStereo = rowElements.filter(row => row.indexOf("far") !== -1 && row.indexOf("stereo") !== -1);

   if (lastStereo.length >= 2) {
      lastStereo = [lastStereo[lastStereo.length - 2], lastStereo[lastStereo.length - 1]];

      rowElements.forEach((row, index) => {
         if (row === lastStereo[0]) {
            rowElements = rowElements.slice(0, index).concat(rowElements.slice(index + 1));
         }
      });

      rowElements.forEach((row, index) => {
         if (row == lastStereo[1]) {
            rowElements = rowElements.slice(0, index).concat(rowElements.slice(index + 1));
         }
      });

   } else {
      lastStereo = rowElements.filter(row => row.indexOf("stereo") !== -1);

      if (lastStereo.length >= 2) {
         lastStereo = [lastStereo[lastStereo.length - 2], lastStereo[lastStereo.length - 1]];

         rowElements.forEach((row, index) => {
            if (row == lastStereo[0]) {
               rowElements = rowElements.slice(0, index).concat(rowElements.slice(index + 1));
            }
         });

         rowElements.forEach((row, index) => {
            if (row == lastStereo[1]) {
               rowElements = rowElements.slice(0, index).concat(rowElements.slice(index + 1));
            }
         });
      }
   }

   // if no far stereo instruments, find last stereo instrument

   // // add speaker first
   // rearrangedRows.push(...rowElements.filter(row => row.indexOf("role-speaker") !== -1));
   // rowElements = rowElements.filter(row => row.indexOf("role-speaker") === -1);

   // then add near vocal channels
   rearrangedRows.push(...rowElements.filter(row => row.indexOf("instr-none") !== -1 && row.indexOf("position-near") !== -1));
   rowElements = rowElements.filter(row => (row.indexOf("instr-none") === -1 || row.indexOf("position-near") === -1));

   // then add far vocal channels
   rearrangedRows.push(...rowElements.filter(row => row.indexOf("instr-none") !== -1));
   rowElements = rowElements.filter(row => row.indexOf("instr-none") === -1);

   // then add near instruments
   rearrangedRows.push(...rowElements.filter(row => row.indexOf("position-near") !== -1));
   rowElements = rowElements.filter(row => row.indexOf("position-near") === -1);

   // then add far instruments
   rearrangedRows.push(...rowElements);

   // if odd number of channels
   if (rearrangedRows.length % 2 !== 0 && lastStereo.length >= 2 && rearrangedRows.length >= 7) {
      rearrangedRows.push(`
         <tr>
            <td class="cell-sm">
            </td>
            <td class="cell-lg">
               <input type="text" value="">
            </td>
            ${cellActions}
         </tr>
      `);
   }

   // then add last stereo instrument
   if (lastStereo.length >= 2) {
      rearrangedRows.push(...lastStereo);
   }

   // add empty channels
   const macbookStereo = document.querySelector('input[name="macbook_stereo[]"]');
   while (rearrangedRows.length < 8 && macbookStereo.checked) {
      rearrangedRows.push(`
         <tr>
            <td class="cell-sm">
            </td>
            <td class="cell-lg">
               <input type="text" value="">
            </td>
            ${cellActions}
         </tr>
      `);
   }

   // then add Macbook
   rearrangedRows.push(`
      <tr>
         <td class="cell-sm">
         </td>
         <td class="cell-lg">
            <input type="text" value="Macbook${macbookStereo.checked ? ` L` : ` Mono`}">
         </td>
         ${cellActions}
      </tr>
   `);

   if (macbookStereo.checked) {
      rearrangedRows.push(`
         <tr>
            <td class="cell-sm">
            </td>
            <td class="cell-lg">
               <input type="text" value="Macbook R">
            </td>
            ${cellActions}
         </tr>
      `);
   }

   // append rows
   rearrangedRows.forEach(row => {
      tbody.innerHTML += row;
   });

   // add channel numbers
   numberChannels(tbody);

   return listChannels(tbody);
}

function handleChange() {

   // disable inputs
   // const inputs = Array.from(rolesTable.querySelectorAll('input, select'));
   // inputs.forEach((input) => {
   //    input.disabled = true;
   // });

   // update selection
   selection = updateSelection(rolesTable);

   // reset equipment
   console.clear();
   [channels, equipment] = resetEquipment(equipment);

   // calculate equipment needed
   console.log("EQUIPMENT LIST");
   [channels, equipment] = calcEquipment(equipAlways, selection, instruments, channels, equipment);

   // list channels
   const channelsTBody = document.querySelector('#channels-table>tbody');
   resetTBody(channelsTBody);
   console.log(populateChannels(selection, channelsTBody));

   // calculate equipment needed from each location
}

addRow();