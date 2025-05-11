//pls deploy

// elements
const rolesTable = document.getElementById('roles-table').getElementsByTagName('tbody')[0];

// global variables and values
let selection = [];
let channels = [];
let equipment = {};

let maxChannels = 12;
let maxMicWireless = 2;

let wirelessIEMChannels;
let wiredIEMChannels;
let wirelessIEMs;
let wiredIEMs;


// add event listeners

const labels = Array.from(document.querySelectorAll('input[type="checkbox"] + label'));
labels.forEach(label => {
   label.addEventListener('click', handleLabelClick);
});


// event helpers

function createInstrumentOptions(instruments) {
   const optionElements = instruments.map(instr => `<option value="${instr.name}">${instr.label}</option>`);
   return optionElements.join('');
}

function moveArrayElem(array, fromIndex, direction) {
   const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;

   // Ensure indices are within bounds
   if (toIndex < 0 || toIndex >= array.length) {
      console.error("Index out of bounds");
      return array;
   }

   // Swap elements
   [array[fromIndex], array[toIndex]] = [array[toIndex], array[fromIndex]];
   return array;
}

function getChildIndex(element) {
   const parent = element.parentNode;
   const children = Array.from(parent.children); // Convert HTMLCollection to Array
   return children.indexOf(element);
}


// events

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

   // get index
   const index = parseInt(row.getAttribute('chan-index'));

   row.remove();

   if (button.classList.contains('channel-controls')) {

      numberChannels(tbody);

      // update channels
      channels.splice(index, 1);

      populateChannelsList(channels, tbody);
   }

}

function moveRowUp(button) {
   const row = button.closest('tr');
   const tbody = button.closest('tbody');
   const previousRow = row.previousElementSibling;

   // get index
   const index = parseInt(row.getAttribute('chan-index'));

   if (previousRow) {
      row.parentNode.insertBefore(row, previousRow);

      if (button.classList.contains('channel-controls')) {

         numberChannels(tbody);

         // update channels
         channels = moveArrayElem(channels, index, "up");

         populateChannelsList(channels, tbody);
      }
   }
}

function moveRowDown(button) {
   const row = button.closest('tr');
   const tbody = button.closest('tbody');
   const nextRow = row.nextElementSibling;

   // get index
   const index = parseInt(row.getAttribute('chan-index'));

   if (nextRow) {
      row.parentNode.insertBefore(nextRow, row);

      if (button.classList.contains('channel-controls')) {

         numberChannels(tbody);

         // update channels
         channels = moveArrayElem(channels, index, "down");

         populateChannelsList(channels, tbody);
      }
   }
}

function handleLabelClick(e) {
   const fieldset = e.currentTarget.closest('fieldset');
   const checkbox = fieldset.querySelector('input[type="checkbox"]');
   checkbox.checked = !checkbox.checked;
}

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


// selection

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


// equipment

function addEquipment({ channels, equipment, musician, equip }) {

   [channels, equipment] = equip(channels, equipment, musician);

   return [channels, equipment];
}

function calcEquipment({ equipAlways, selection, instruments, channels, equipment }) {

   // always add this equipment

   [channels, equipment] = addEquipment({ channels: channels, equipment: equipment, equip: equipAlways });

   // musicians

   selection.forEach(musician => {

      const instrument = instruments.find(instr => instr.name === musician.instrument);

      [channels, equipment] = addEquipment({
         channels: channels,
         equipment: equipment,
         musician: musician,
         equip: (channels, equipment, musician) => {

            [channels, equipment] = instrument.equip(musician, channels, equipment);

            return [channels, equipment];

         }
      });
   });

   // remove properties that equal 0
   for (const key in equipment) {
      if (equipment[key] === 0) {
         delete equipment[key];
      }
   }

   console.log("Equipment:");
   console.log(equipment);

   return [channels, equipment];
}

function sourceEquipment(equipment, locations) {

   const locs = JSON.parse(JSON.stringify(locations));
   const eq = JSON.parse(JSON.stringify(equipment));
   const needs = {};

   // for each location
   for (let [locName, locInventory] of Object.entries(locs)) {

      needs[locName] = {};

      // for each piece of equipment
      for (let [eqItem, eqQty] of Object.entries({ ...eq })) {

         // only if needed
         if (eqQty && eqQty > 0) {

            if (locInventory[eqItem]) {

               const diff = locInventory[eqItem] - eqQty;

               if (diff > 0) {

                  // need equipment from this location
                  needs[locName][eqItem] = eqQty;

                  // don't need any more equipment
                  delete eq[eqItem];

                  // remaining quantity of equipment at location
                  locs[locName][eqItem] = diff;

               } else if (diff === 0) {

                  // need equipment from this location
                  needs[locName][eqItem] = eqQty;

                  // don't need any more equipment
                  delete eq[eqItem];

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
   }

   // loop through remaining items needed
   for (let [eqItem, eqQty] of Object.entries({ ...eq })) {

      // still need equipment
      if (eqQty && eqQty > 0) {

         // substitutes available
         if (substitutes[eqItem]) {

            // loop through substitutes
            substitutes[eqItem].forEach(sub => {

               // loop through location inventories to find substitute
               for (let [locName, locInventory] of Object.entries(locs)) {

                  if (locInventory[sub.item]) {

                     const diff = locInventory[sub.item] - eqQty * sub.quantity;

                     if (diff > 0) {

                        // need equipment from this location
                        needs[locName][sub.item] = eqQty * sub.quantity;

                        // don't need any more equipment
                        delete eq[eqItem];

                        // remaining quantity of equipment at location
                        locs[locName][sub.item] = diff;

                     } else if (diff === 0) {

                        // need equipment from this location
                        needs[locName][sub.item] = eqQty * sub.quantity;

                        // don't need any more equipment
                        delete eq[eqItem];

                        // no more equipment at location
                        locs[locName][sub.item] = 0;

                     } else if (diff < 0) {

                        // need equipment from this location
                        needs[locName][sub.item] = locs[locName][sub.item];

                        // need more equipment still
                        eqQty = -diff;

                        // no more equipment at location
                        locs[locName][sub.item] = 0;
                     }
                  }
               }
            });
         }
      }
   }

   // not enough equipment
   needs["Not Enough"] = eq;

   console.log("Needs:");
   console.log(needs);

   return needs;
}

function populateEquipmentTable(tbody, locationNeeds) {

   // reset table
   tbody.innerHTML = "";

   // populate table
   for (let [item, qty] of Object.entries(locationNeeds)) {

      const checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');

      const label = document.createElement('label');
      label.innerText = item;

      const fieldset = document.createElement('fieldset');
      fieldset.appendChild(checkbox);
      fieldset.appendChild(label);

      const td1 = document.createElement('td');
      td1.classList.add('cell-lg');
      td1.appendChild(fieldset);

      const td2 = document.createElement('td');
      td2.classList.add('cell-sm');
      td2.innerText = qty;

      const row = document.createElement('tr');
      row.appendChild(td1);
      row.appendChild(td2);

      // const row = `
      //    <tr>
      //       <td class="cell-lg">
      //          <fieldset>
      //             <input type="checkbox">
      //             <label>${item}</label>
      //          </fieldset>
      //       </td>
      //       <td class="cell-sm">${qty}</td>
      //    </tr>
      // `;

      // tbody.innerHTML += row;
      tbody.appendChild(row);
   }

   const labels = Array.from(tbody.querySelectorAll('label'));
   labels.forEach(label => {
      label.addEventListener('click', handleLabelClick);
   });
}

function populateEquipmentList(tbody, location, locationID, locationNeeds) {

   const section = tbody.closest('section');

   // reset list
   let existingList = section.querySelector('.list');
   if (existingList) { existingList.remove(); }

   // create <li> elements
   let listItems = '';
   for (let [item, qty] of Object.entries(locationNeeds)) {
      listItems += `<li>${item} x${qty}</li>`;
   }
   
   // create <ol> from array
   const list = `
      <div class="list">
         <h3>${location}</h3>
         <ul id="${locationID}-list">
            ${listItems}
         </ul>
      </div>
   `;

   // append <ol> to channels-section
   section.innerHTML += list;

   return list;
}

function populateEquipment(needs) {

   const tableIds = {
      "St. Andrew's Hall": "st-andrews-hall-table",
      "Neighbours Hall": "neighbours-hall-table",
      "Not Enough": "not-enough-table"
   };

   for (let [location, locationNeeds] of Object.entries(needs)) {

      const tbody = document.getElementById(tableIds[location]).getElementsByTagName('tbody')[0];
      populateEquipmentTable(tbody, locationNeeds);
      populateEquipmentList(tbody, location, tableIds[location], locationNeeds);

   }
}


// channels

function numberChannels(tbody) {
   const rowNodes = Array.from(tbody.querySelectorAll('tr>td.cell-sm'));
   rowNodes.forEach((node, index) => {
      node.innerText = `${index + 1}.`;
      node.closest('tr').setAttribute('chan-index', index);
   });
}

function populateChannelsList(channels, tbody) {

   const section = tbody.closest('section');

   // reset list
   let existingList = section.querySelector('.list');
   if (existingList) { existingList.remove(); }

   // create <li> elements
   const listItems = channels.map((chan, index) => `
      <li chan-data='${JSON.stringify(chan)}' chan-index='${index}'>
         ${chan.label}${chan.musician ? (chan.musician.name ? ` (${chan.musician.name})` : ``) : ``}
      </li>
   `);

   // create <ol> from array
   const list = `
      <div class="list">
         <h3>Channels List</h3>
         <ol id="channels-list">
            ${listItems.join("")}
         </ol>
      </div>
   `;

   // append <ol> to channels-section
   section.innerHTML += list;

   return list;
}

function reorderChannels(channels) {

   const orderedChannels = [];

   // take out end channels
   const endFilter = chan => chan.label.indexOf("Macbook") !== -1;
   const endChannels = channels.filter(endFilter);
   channels = channels.filter(chan => !endFilter(chan));

   // take out last stereo instrument

   let lastStereo = [];

   // query far stereo channels (changed to near)
   const farStereoFilter = chan => (chan.musician.stereo && chan.musician.position === "near" && chan.label !== "Mic");
   const farStereoChannels = channels.filter(farStereoFilter);

   if (farStereoChannels.length >= 2) {
      
      lastStereo = [
         farStereoChannels[farStereoChannels.length - 1],
         farStereoChannels[farStereoChannels.length - 2]
      ];

      // take out
      channels = channels.filter(chan => (
         chan !== lastStereo[0] && chan !== lastStereo[1]
      ));

   } else {

      // query for stereo channels
      const stereoFilter = chan => (chan.musician.stereo && chan.label !== "Mic");
      const stereoChannels = channels.filter(stereoFilter);

      if (stereoChannels.length >= 2) {

         lastStereo = [
            stereoChannels[stereoChannels.length - 1],
            stereoChannels[stereoChannels.length - 2]
         ];
         
         // take out
         channels = channels.filter(chan => (
            chan !== lastStereo[0] && chan !== lastStereo[1]
         ));
      }
   }

   // add channels in this order
   const filters = [
      // far mics
      chan => (chan.label === "Mic" && chan.musician.position === "far"),
      // near mics
      chan => (chan.label === "Mic" && chan.musician.position === "near"),
      // far instruments
      chan => (chan.musician.position === "far"),
      // all other instruments
      chan => (chan => true)
   ];

   filters.forEach((filter, i) => {
      orderedChannels.push(...channels.filter(filters[i]));
      channels = channels.filter(chan => !filters[i](chan));
   });

   if (orderedChannels.length > 6) {
      
      // add extra channels
      while (orderedChannels.length < (maxChannels - 4)) {
         orderedChannels.push({ label: "" });
      }

      // add end channels
      orderedChannels.push(...endChannels);

      // add lastStereo channels
      if (lastStereo.length === 2) {
         orderedChannels.push(lastStereo[1], lastStereo[0]);
      }

      // add extra channels again
      while ((orderedChannels.length) < maxChannels) {
         orderedChannels.push({ label: "" });
      }
   
   } else {

      // add lastStereo channels
      if (lastStereo.length === 2) {
         orderedChannels.push(lastStereo[1], lastStereo[0]);
      }

      // add extra channels
      while ((orderedChannels.length + endChannels.length) < (maxChannels - 2)) {
         orderedChannels.push({ label: "" });
      }

      // add end channels
      orderedChannels.push(...endChannels);

      // add extra channels again
      while ((orderedChannels.length) < maxChannels) {
         orderedChannels.push({ label: "" });
      }
   }

   return orderedChannels;
}

function populateChannelsTable(channels, tbody) {

   // reset table
   tbody.innerHTML = "";

   // create <row> elements
   const rows = channels.map((chan, index) => {

      const equipmentListItems = [];

      if (chan.equipment) {
         for (let [item, qty] of Object.entries(chan.equipment)) {
            equipmentListItems.push(`<li>${item} x${qty}</li>`);
         }
      }

      return `
         <tr chan-data='${JSON.stringify(chan)}' chan-index='${index}'>
            <td class="cell-sm">
            </td>
            <td class="cell-lg cell-flex-col">
               <p>${chan.label}${chan.musician ? (chan.musician.name ? ` (${chan.musician.name})` : ``) : ``}</p>
               ${equipmentListItems.length > 0 ? `<ul class="channel-equipment">${equipmentListItems.join('')}</ul>` : ``}
            </td>
            <td class="cell-actions-sm">
               <button class="channel-controls" type="button" onclick="moveRowUp(this)">&uarr;</button>
               <button class="channel-controls" type="button" onclick="moveRowDown(this)">&darr;</button>
               <button class="channel-controls" type="button" onclick="removeRow(this)">&ndash;</button>
            </td>
         </tr>
      `;
   });

   // append rows
   rows.forEach(row => {
      tbody.innerHTML += row;
   });

   // add channel numbers
   numberChannels(tbody);

   console.log("Channels:");
   console.log(channels);
}

// handle change

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
   maxMicWireless = 2;
   channels = [];
   equipment = {};
   wirelessIEMChannels = parseInt(document.querySelector('select[name="wireless_iem_channels[]"]').value);
   wiredIEMChannels = parseInt(document.querySelector('select[name="wired_iem_channels[]"]').value);
   wirelessIEMs = locations["St. Andrew's Hall"]["IEM Receiver (Wireless)"];
   wiredIEMs = wiredIEMChannels;

   // calculate equipment needed
   console.log("EQUIPMENT LIST");
   [channels, equipment] = calcEquipment({
      equipAlways: equipAlways,
      selection: selection,
      instruments: instruments,
      channels: channels,
      equipment: equipment
   });

   // reorder channels
   channels = reorderChannels(channels);

   // populate channels table and list
   const channelsTBody = document.querySelector('#channels-table>tbody');
   populateChannelsTable(channels, channelsTBody);
   populateChannelsList(channels, channelsTBody);

   // source equipment needed from each location
   populateEquipment(sourceEquipment(equipment, locations));

   const labels = Array.from(document.querySelectorAll('td label'));
   labels.forEach(label => {
      label.addEventListener('click', handleLabelClick);
   });
}


// at startup

addRow();
