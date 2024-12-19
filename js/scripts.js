// max channels
// empty states
// alert (out of date)
// wireless mics
// need to check if item exists in location
// need to check if item exists in equipment when adding quantities
// set equipment variable based on keys of inventories
// on channel field change

// elements
const rolesTable = document.getElementById('roles-table').getElementsByTagName('tbody')[0];


// global variables
let selection = [];
let channels = 0;
let equipment = {

      // POWER
      "Extension Cord": 0,
      "Power Bar": 0,

      // PROJECTION
      "Projector": 0,
      "HDMI (Extended)": 0,
      "HDMI": 0,
      "USB-C Adapter": 0,

      // LIGHTING
      "Side Flood Lights": 0,
      "Stage PAR": 0,
      "Stage Wash": 0,
      "DMX Transmitter": 0,
      "DMX Receiver": 0,
      "USB to DMX Adapter": 0,
      "USB-C Adapter": 0,
      "Light Stand": 0,

      // SOUND
      // Cables
      "XLR": 0,
      "XLR (Long)": 0,
      "TS Cable": 0,
      "TS Cable (Long)": 0,
      "Snake": 0,

      // Mics
      "Mic (Wireless)": 0,
      "Mic (Wired)": 0,
      "Mic (Instrument)": 0,

      // DI
      "DI Box": 0,
      "DI Box (Dual)": 0,

      // Monitors
      "Wedge": 0,
      "Power Cable": 0,

      // Stands
      "Music Stand": 0,
      "Boom Stand": 0,
      "Boom Stand (Short)": 0,

      // Instruments
      "Acoustic Guitar": 0,
      "Keyboard": 0,
      "Bass": 0
}

function createRoleOptions(roles) {
   const optionElements = roles.map(role => `<option value="${role.name}">${role.label}</option>`);
   return optionElements.join('');
}

function addRow() {
   const newRow = rolesTable.insertRow();

   newRow.innerHTML = `
      <td class="cell-lg">
         <input type="text" name="name[]" placeholder="Enter Name" style="width: 100%;" maxlength="20">
      </td>
      <td class="cell-lg">
         <select name="role[]" onchange="handleRoleChange(this)">
            ${createRoleOptions(roles)}
         </select>
      </td>
      <td class="cell-sm">
         <input type="checkbox" name="singing[]" value="yes" checked disabled>
      </td>
      <td class="cell-sm">
         <input type="checkbox" name="bringing[]" value="yes" disabled>
      </td>
      <td class="cell-sm">
         <input type="checkbox" name="stereo[]" value="yes" disabled>
      </td>
      <td class="cell-md">
         <select name="position[]">
            <option value="near">Near</option>
            <option value="far">Far</option>
         </select>
      </td>
      <td class="cell-actions-sm">
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


function handleRoleChange(select) {
   const row = select.closest('tr');
   const singing = row.querySelector('input[name="singing[]"]');
   const bringing = row.querySelector('input[name="bringing[]"]');
   const stereo = row.querySelector('input[name="stereo[]"]');

   const constraints = roles.find(role => role.name === select.value).constraints;

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
         role: row.querySelector('select[name="role[]"]').value,
         singing: row.querySelector('input[name="singing[]"]').checked,
         bringing: row.querySelector('input[name="bringing[]"]').checked,
         stereo: row.querySelector('input[name="stereo[]"]').checked,
         position: row.querySelector('select[name="position[]"]').value
      }
   });
}

function resetEquipment(equipment) {

   channels = 0;

   Object.keys(equipment).forEach(item => {
      equipment[item] = 0;
   });

   return [channels, equipment];
}

function getEquipmentDiff(obj1, obj2) {
   const differences = {};

   for (const key in obj1) {
      if (Object.prototype.hasOwnProperty.call(obj2, key) && typeof obj1[key] === 'number' && typeof obj2[key] === 'number') {
         const difference = obj1[key] - obj2[key];
         if (difference !== 0) {
            differences[key] = difference;
         }
      }
   }

   return differences;
}

function addEquipment(channels, equipment, equip, name, role) {

   const equipmentBefore = { ...equipment };
   const channelsBefore = channels;

   [channels, equipment] = equip(channels, equipment);

   const log = { equipment: getEquipmentDiff(equipment, equipmentBefore), channels: channels - channelsBefore };
   if (role) { log.name = name; log.role = role; }
   console.log(log);

   return [channels, equipment];
}

function calcEquipment(equipAlways, selection, roles, channels, equipment) {

   // always add this equipment
   console.log("Always:");
   [channels, equipment] = addEquipment(channels, equipment, equipAlways);

   console.log("Musicians:");
   selection.forEach(musician => {

      const role = roles.find(role => role.name === musician.role);

      [channels, equipment] = addEquipment(channels, equipment, (channels, equipment) => {

         [channels, equipment] = role.equip({
            singing: musician.singing,
            bringing: musician.bringing,
            stereo: musician.stereo,
            position: musician.position
         }, channels, equipment);

         return [channels, equipment];

      }, musician.name, musician.role);
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
   for (let [locName, locVal] in locs) {

      needs[locName] = {};
      
      // for each piece of equipment
      for (let [eqType, eqVal] in eq) {
         
         // only if needed
         if (eqVal && eqVal > 0) {
            
            const diff = locVal[eqType] - eqVal;
            
            if (diff > 0) {
               
               // need equipment from this location
               needs[locName][eqType] = eqVal;

               // don't need any more equipment
               eq[eqType] = 0;

               // remaining quantity of equipment at location
               locs[locName][eqType] = diff;

            } else if (diff === 0) {

               // need equipment from this location
               needs[locName][eqType] = eqVal;

               // don't need any more equipment
               eq[eqType] = 0;

               // no more equipment at location
               locs[locName][eqType] = 0;

            } else if (diff < 0) {

               // need equipment from this location
               needs[locName][eqType] = locs[locName][eqType];

               // need more equipment still
               eq[eqType] = -diff;

               // no more equipment at location
               locs[locName][eqType] = 0;
            }
         }
      }

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

function populateChannelsList(selection, tbody) {

   const cellActions = `
      <td class="cell-actions-sm">
         <button class="channel-controls" type="button" onclick="moveRowUp(this)">&uarr;</button>
         <button class="channel-controls" type="button" onclick="moveRowDown(this)">&darr;</button>
         <button class="channel-controls" type="button" onclick="removeRow(this)">&ndash;</button>
      </td>
   `;

   let channelCounter = 1;
   let rowElements = selection.map((musician) => {

      const roleLabel = roles.find(role => role.name === musician.role).label;

      let rowCode = `
         <tr class="role-${musician.role} position-${musician.position} ${musician.stereo ? `stereo` : ``}">
            <td class="cell-sm">
            </td>
            <td class="cell-lg">
               <input type="text" value="${roleLabel}${musician.stereo ? ` L` : ``}${musician.name ? ` (${musician.name})` : ``}">
            </td>
            ${cellActions}
         </tr>
         ${musician.stereo ? `
            <!-- split -->
            <tr class="role-${musician.role} position-${musician.position} ${musician.stereo ? `stereo` : ``}">
               <td class="cell-sm">
               </td>
               <td class="cell-lg">
                  <input type="text" value="${roleLabel} R${musician.name ? ` (${musician.name})` : ``}">
               </td>
               ${cellActions}
            </tr>
         ` : ``}
      `;

      channelCounter++;

      if (musician.stereo) {
         channelCounter++;
      }

      if (musician.singing && musician.role !== "vocal" && musician.role !== "speaker") {
         rowCode += `
            <!-- split -->
            <tr class="role-vocal position-${musician.position}">
               <td class="cell-sm">
               </td>
               <td class="cell-lg">
                  <input type="text" value="Vocal${musician.name ? ` (${musician.name})` : ``}">
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

   // add speaker first
   rearrangedRows.push(...rowElements.filter(row => row.indexOf("role-speaker") !== -1));
   rowElements = rowElements.filter(row => row.indexOf("role-speaker") === -1);

   // then add near vocal channels
   rearrangedRows.push(...rowElements.filter(row => row.indexOf("role-vocal") !== -1 && row.indexOf("position-near") !== -1));
   rowElements = rowElements.filter(row => (row.indexOf("role-vocal") === -1 || row.indexOf("position-near") === -1));

   // then add far vocal channels
   rearrangedRows.push(...rowElements.filter(row => row.indexOf("role-vocal") !== -1));
   rowElements = rowElements.filter(row => row.indexOf("role-vocal") === -1);

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
   [channels, equipment] = calcEquipment(equipAlways, selection, roles, channels, equipment);

   // list channels
   const channelsTBody = document.querySelector('#channels-table>tbody');
   resetTBody(channelsTBody);
   console.log(populateChannelsList(selection, channelsTBody));

   // calculate equipment needed from each location
}

addRow();