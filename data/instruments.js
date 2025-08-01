function addItem(equipment, item, add, chan) {

   if (equipment[item] === undefined || equipment[item] === null) {
      equipment[item] = 0;
   }

   equipment[item] += add;

   if (chan) {

      if (!chan.equipment) {
         chan.equipment = {};
      }

      if (chan.equipment[item] === undefined || chan.equipment[item] === null) {
         chan.equipment[item] = 0;
      }

      chan.equipment[item] += add;

      return [equipment, chan];
   }

   return equipment;
}

function xlrLength(musician) {
   return musician.position === "far" ? "XLR Cable (50ft)" : "XLR Cable";
}

function equipSinging(musician, equipment, chans) {

   if (musician.singing) {

      const i = chans.length;

      chans.push({ label: "Mic", musician: musician });

      const usingWireless = document.querySelector('input[name="use_wireless_mics[]"]').checked;

      // using wireless
      if (usingWireless && maxMicWireless > 0) {
         [equipment, chans[i]] = addItem(equipment, "Mic (Wireless)", 1, chans[i]);
         maxMicWireless--;

      // using wired 
      } else {
         [equipment, chans[i]] = addItem(equipment, "Mic (Wired)", 1, chans[i]);
         [equipment, chans[i]] = addItem(equipment, xlrLength(musician), 1, chans[i]);
      }

      // add boom stand regardless
      [equipment, chans[i]] = addItem(equipment, "Boom Stand", 1, chans[i]);
   }

   return [equipment, chans];
}

function equipIEM(musician, equipment, chan) {

   if (musician.iem) {

      if (chan) {
         if (wirelessIEMChannels > 0 && wirelessIEMs > 0) {
            [equipment, chan] = addItem(equipment, "IEM Receiver (Wireless)", 1, chan);
            [equipment, chan] = addItem(equipment, "AA Battery", 2, chan);
            wirelessIEMs--;
         } else if (wiredIEMChannels > 0 && wiredIEMs > 0) {
            [equipment, chan] = addItem(equipment, "IEM Receiver (Wired)", 1, chan);
            [equipment, chan] = addItem(equipment, "AA Battery", 2, chan);
            wiredIEMs--;
         } else {
            [equipment, chan] = addItem(equipment, "IEM Receiver (Any)", 1, chan);
            [equipment, chan] = addItem(equipment, "AA Battery", 2, chan);
         }

         return [equipment, chan];
      } else {
         if (wirelessIEMChannels > 0 && wirelessIEMs > 0) {
            equipment = addItem(equipment, "IEM Receiver (Wireless)", 1);
            equipment = addItem(equipment, "AA Battery", 2);
            wirelessIEMs--;
         } else if (wiredIEMChannels > 0 && wiredIEMs > 0) {
            equipment = addItem(equipment, "IEM Receiver (Wired)", 1);
            equipment = addItem(equipment, "AA Battery", 2);
            wiredIEMs--;
         } else {
            equipment = addItem(equipment, "IEM Receiver (Any)", 1);
            equipment = addItem(equipment, "AA Battery", 2);
         }

         return equipment;
      }

   } else {

      if (chan) {
         return [equipment, chan];
      } else {
         return equipment;
      }
   }
}

const instruments = [
   {
      name: "none",
      label: "None",
      constraints: {
         singing: { checked: true, disabled: true },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: true }
      },
      equip: (musician, channels, equipment) => {

         let chans = [];

         [equipment, chans] = equipSinging(musician, equipment, chans);
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "acoustic_guitar",
      label: "Acoustic Guitar",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: false },
         stereo: { checked: false, disabled: true }
      },
      equip: (musician, channels, equipment) => {

         let chans = [{ label: "Acoustic Guitar", musician: musician }];

         if (!musician.bringing) {
            [equipment, chans[0]] = addItem(equipment, "Acoustic Guitar", 1, chans[0]);
         }

         // always
         [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "DI Box", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Guitar Stand", 1, chans[0]);

         // IEM
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);

         // singing
         [equipment, chans] = equipSinging(musician, equipment, chans);

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "piano",
      label: "Piano",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: false }
      },
      equip: (musician, channels, equipment) => {

         let chans = [{ label: `Piano`, musician: musician }];
         [equipment, chans[0]] = addItem(equipment, "Mic (SM57)", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Boom Stand", 1, chans[0]);
         
         if (musician.stereo) {
            chans[0].label = `Piano L`;
            chans.push({ label: `Piano R`, musician: musician });
            [equipment, chans[1]] = addItem(equipment, "Mic (SM57)", 1, chans[1]);
            [equipment, chans[1]] = addItem(equipment, xlrLength(musician), 1, chans[1]);
            [equipment, chans[1]] = addItem(equipment, "Boom Stand", 1, chans[1]);
         }

         // IEM
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);

         // singing
         [equipment, chans] = equipSinging(musician, equipment, chans);

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "piano_unplugged",
      label: "Piano (unplugged)",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: true }
      },
      equip: (musician, channels, equipment) => {

         let chans = [];

         // singing
         [equipment, chans] = equipSinging(musician, equipment, chans);

         if (chans.length > 0) {
            [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);
         } else {
            equipment = equipIEM(musician, equipment);
         }

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "keyboard_mainstage",
      label:"Keyboard (Mainstage)",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: true }
      },
      equip(musician, channels, equipment) {

         let chans = [];

         chans.push({ label: `Keyboard`, musician: musician });

         if (!musician.bringing) {
            [equipment, chans[0]] = addItem(equipment, "Keyboard", 1, chans[0]);
            [equipment, chans[0]] = addItem(equipment, "Keyboard Stand", 1, chans[0]);
         }

         // always
         [equipment, chans[0]] = addItem(equipment, "MIDI Cable", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "3.5mm TRS Cable", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "DI Box", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Extension Cord", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);

         // singing
         [equipment, chans] = equipSinging(musician, equipment, chans);

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "keyboard",
      label: "Keyboard (TS out)",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: false }
      },
      equip(musician, channels, equipment) {

         let chans = [];

         // if stereo, need double the equipment
         if (musician.stereo) {

            chans.push({ label: `Keyboard L`, musician: musician }, { label: `Keyboard R`, musician: musician });

            if (!musician.bringing) {
               [equipment, chans[0]] = addItem(equipment, "Keyboard", 1, chans[0]);
               [equipment, chans[0]] = addItem(equipment, "Keyboard Stand", 1, chans[0]);
            }

            [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
            [equipment, chans[1]] = addItem(equipment, "1/4 TS Cable", 1, chans[1]);

            [equipment, chans[0]] = addItem(equipment, "DI Box (Stereo)", 1, chans[0]);

            [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
            [equipment, chans[1]] = addItem(equipment, xlrLength(musician), 1, chans[1]);

         // if mono
         } else {

            chans.push({ label: `Keyboard`, musician: musician });

            if (!musician.bringing) {
               [equipment, chans[0]] = addItem(equipment, "Keyboard", 1, chans[0]);
               [equipment, chans[0]] = addItem(equipment, "Keyboard Stand", 1, chans[0]);
            }

            [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
            [equipment, chans[0]] = addItem(equipment, "DI Box", 1, chans[0]);
            [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
         }

         // always
         [equipment, chans[0]] = addItem(equipment, "Extension Cord", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);

         // singing
         [equipment, chans] = equipSinging(musician, equipment, chans);

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "keyboard_balanced",
      label: "Keyboard (XLR out)",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: false }
      },
      equip(musician, channels, equipment) {

         let chans = [];

         // if stereo, need double the equipment
         if (musician.stereo) {

            chans.push({ label: `Keyboard L`, musician: musician }, { label: `Keyboard R`, musician: musician });

            if (!musician.bringing) {
               [equipment, chans[0]] = addItem(equipment, "Keyboard", 1, chans[0]);
               [equipment, chans[0]] = addItem(equipment, "Keyboard Stand", 1, chans[0]);
            }

            [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
            [equipment, chans[1]] = addItem(equipment, xlrLength(musician), 1, chans[1]);

            // if mono
         } else {

            chans.push({ label: `Keyboard`, musician: musician });
            
            if (!musician.bringing) {
               [equipment, chans[0]] = addItem(equipment, "Keyboard", 1, chans[0]);
               [equipment, chans[0]] = addItem(equipment, "Keyboard Stand", 1, chans[0]);
            }            

            [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
         }

         // always
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);
         

         // singing
         [equipment, chans] = equipSinging(musician, equipment, chans);

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "electric_guitar",
      label: "Electric Guitar (TS out)",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: true, disabled: true },
         stereo: { checked: false, disabled: false }
      },
      equip: (musician, channels, equipment) => {

         // always
         let chans = [];

         // if stereo, need double
         if (musician.stereo) {

            chans.push({ label: `Electric Guitar L`, musician: musician }, { label: `Electric Guitar R`, musician: musician });

            [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
            [equipment, chans[1]] = addItem(equipment, "1/4 TS Cable", 1, chans[1]);

            [equipment, chans[0]] = addItem(equipment, "DI Box (Stereo)", 1, chans[0]);

            [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
            [equipment, chans[1]] = addItem(equipment, xlrLength(musician), 1, chans[1]);

         } else {

            chans.push({ label: `Electric Guitar`, musician: musician });

            [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
            [equipment, chans[0]] = addItem(equipment, "DI Box", 1, chans[0]);
            [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
         }

         // always
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Guitar Stand", 1, chans[0]);
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);

         // singing
         [equipment, chans] = equipSinging(musician, equipment, chans);

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "electric_guitar_balanced",
      label: "Electric Guitar (XLR out)",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: true, disabled: true },
         stereo: { checked: false, disabled: false }
      },
      equip: (musician, channels, equipment) => {

         // always
         let chans = [];

         // if stereo, need double
         if (musician.stereo) {

            chans.push({ label: `Electric Guitar L`, musician: musician }, { label: `Electric Guitar R`, musician: musician });

            [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
            [equipment, chans[1]] = addItem(equipment, xlrLength(musician), 1, chans[1]);

         } else {

            chans.push({ label: `Electric Guitar`, musician: musician });

            [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
         }

         // always
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Guitar Stand", 1, chans[0]);
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);

         // singing
         [equipment, chans] = equipSinging(musician, equipment, chans);

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "bass",
      label: "Bass",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: false },
         stereo: { checked: false, disabled: true }
      },
      equip: (musician, channels, equipment) => {

         let chans = [{ label: `Bass`, musician: musician }];

         if (!musician.bringing) {
            [equipment, chans[0]] = addItem(equipment, "Bass", 1, chans[0]);
         }

         // always
         [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "DI Box", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Guitar Stand", 1, chans[0]);
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);

         // singing
         [equipment, chans] = equipSinging(musician, equipment, chans);

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "violin",
      label: "Violin",
      constraints: {
         singing: { checked: false, disabled: true },
         bringing: { checked: true, disabled: true },
         stereo: { checked: false, disabled: true }
      },
      equip: (musician, channels, equipment) => {

         // always
         let chans = [{ label: "Violin", musician: musician }];

         [equipment, chans[0]] = addItem(equipment, "Mic (SM57)", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Boom Stand", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);

         channels.push(...chans);

         return [channels, equipment];
      }
   },
   {
      name: "cajon",
      label: "Cajon",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: false },
         stereo: { checked: false, disabled: false }
      },
      equip: (musician, channels, equipment) => {

         let chans = [{ label: `Cajon`, musician: musician }];

         if (!musician.bringing) {
            [equipment, chans[0]] = addItem(equipment, "Cajon", 1, chans[0]);
         }

         // always
         [equipment, chans[0]] = addItem(equipment, "Mic (Beta SM52a)", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, xlrLength(musician), 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Boom Stand (Short)", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = equipIEM(musician, equipment, chans[0]);

         if (musician.stereo) {
            chans[0].label = `Cajon Back`;
            chans.push({ label: `Cajon Front`, musician: musician });
            [equipment, chans[1]] = addItem(equipment, "Mic (SM57)", 1, chans[1]);
            [equipment, chans[1]] = addItem(equipment, xlrLength(musician), 1, chans[1]);
            [equipment, chans[1]] = addItem(equipment, "Boom Stand (Short)", 1, chans[1]);
         }

         // singing
         [equipment, chans] = equipSinging(musician, equipment, chans);

         channels.push(...chans);

         return [channels, equipment];
      }
   }
]