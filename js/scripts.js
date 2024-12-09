// max channels
// make list from channel rowElements
// empty states
// add channel row
// alert (out of date)
// wireless mics
// click fieldset
// change "Remove" to "-"

// elements
const rolesTable = document.getElementById('roles-table').getElementsByTagName('tbody')[0];


// global variables
let selection = [];
let channels = 0;
let equipment = {
   xlr: 0,
   xlrLong: 0,
   tsCable: 0,
   tsCableLong: 0,
   powerCable: 0,
   snake: 0,

   micWireless: 0,
   micWired: 0,
   micInstrument: 0,

   diBox: 0,
   diBoxDual: 0,

   wedge: 0,

   musicStand: 0,
   boomStand: 0,
   boomStandShort: 0,

   acousticGuitar: 0,
   keyboard: 0,
   bass: 0
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
      <td class="cell-actions">
         <button type="button" onclick="moveRowUp(this)">&uarr;</button>
         <button type="button" onclick="moveRowDown(this)">&darr;</button>
         <button type="button" onclick="removeRow(this)">Remove</button>
      </td>
   `;
}

function removeRow(button) {
   const row = button.closest('tr');
   const tbody = button.closest('tbody');

   row.remove();

   if (button.classList.contains('channel-controls')); {
      numberChannels(tbody);
   }

}

function moveRowUp(button) {
   const row = button.closest('tr');
   const tbody = button.closest('tbody');
   const previousRow = row.previousElementSibling;

   if (previousRow) {
      row.parentNode.insertBefore(row, previousRow);

      if (button.classList.contains('channel-controls')); {
         numberChannels(tbody);
      }
   }
}

function moveRowDown(button) {
   const row = button.closest('tr');
   const tbody = button.closest('tbody');
   const nextRow = row.nextElementSibling;

   if (nextRow) {
      row.parentNode.insertBefore(nextRow, row);

      if (button.classList.contains('channel-controls')); {
         numberChannels(tbody);
      }
   }
}

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

function resetTBody(tbody) {
   tbody.innerHTML = "";
}

function numberChannels(tbody) {
   const rowNodes = Array.from(tbody.querySelectorAll('tr>td.cell-sm'));
   rowNodes.forEach((node, index) => {
      node.innerText = `${index + 1}.`;
   });
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

   let listElements = selection.map(musician => {

      const roleLabel = roles.find(role => role.name === musician.role).label;

      let liCode = `
         <li class="role-${musician.role} position-${musician.position} ${musician.stereo ? `stereo` : ``}">
            ${roleLabel}${musician.stereo ? ` L` : ``}${musician.name ? ` (${musician.name})` : ``}
         </li>
         ${musician.stereo ? `
            <!-- split -->
            <li class="role-${musician.role} position-${musician.position} ${musician.stereo ? `stereo` : ``}">
               ${roleLabel} R${musician.name ? ` (${musician.name})` : ``}
            </li>
         ` : ``}
      `;

      if (musician.singing && musician.role !== "vocal" && musician.role !== "speaker") {
         liCode += `
            <!-- split -->
            <li class="role-vocal position-${musician.position}">
               Vocal${musician.name ? ` (${musician.name})` : ``}
            </li>
         `;
      }

      return liCode;
   });


   // split rows properly
   rowElements = rowElements.join('<!-- split -->').split('<!-- split -->');

   // rearrange rows
   const rearrangedRowElements = [];

   // find last far stereo instrument
   let lastStereo = rowElements.filter(row => row.indexOf("far") !== -1 && row.indexOf("stereo" !== - 1));

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
   rearrangedRowElements.push(...rowElements.filter(row => row.indexOf("role-speaker") !== -1));
   rowElements = rowElements.filter(row => row.indexOf("role-speaker") === -1);

   // then add near vocal channels
   rearrangedRowElements.push(...rowElements.filter(row => row.indexOf("role-vocal") !== -1 && row.indexOf("position-near") !== -1));
   rowElements = rowElements.filter(row => (row.indexOf("role-vocal") === -1 || row.indexOf("position-near") === -1));

   // then add far vocal channels
   rearrangedRowElements.push(...rowElements.filter(row => row.indexOf("role-vocal") !== -1));
   rowElements = rowElements.filter(row => row.indexOf("role-vocal") === -1);

   // then add near instruments
   rearrangedRowElements.push(...rowElements.filter(row => row.indexOf("position-near") !== -1));
   rowElements = rowElements.filter(row => row.indexOf("position-near") === -1);

   // then add far instruments
   rearrangedRowElements.push(...rowElements);

   // if odd number of channels
   if (rearrangedRowElements.length % 2 !== 0 && lastStereo.length >= 2 && rearrangedRowElements.length >= 7) {
      rearrangedRowElements.push(`
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
      rearrangedRowElements.push(...lastStereo);
   }

   // add empty channels
   const macbookStereo = document.querySelector('input[name="macbook_stereo[]"]');
   while (rearrangedRowElements.length < 8 && macbookStereo.checked) {
      rearrangedRowElements.push(`
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

   rearrangedRowElements.push(`
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
      rearrangedRowElements.push(`
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
   rearrangedRowElements.forEach(row => {
      tbody.innerHTML += row;
   });

   // add channel numbers
   numberChannels(tbody);

   const list = `<ol>${listElements.join('')}</ol>`;

   return list;
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