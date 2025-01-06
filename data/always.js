function equipAlways(channels, equipment) {

   // Sean or Josh – could you add the equipment we need every time with the following syntax:
   // equipment = addItem(equipment, "Item Name", quantity);

   // to add one: equipment = addItem(equipment, "Item Name", 1);
   // to add three: equipment = addItem(equipment, "Item Name", 1);
   // item names should correspond to inventory.js

   // POWER

   // add power equipment here

   // PROJECTION

   equipment = addItem(equipment, "Projector", 1);
   equipment = addItem(equipment, "HDMI Cable", 1);
   equipment = addItem(equipment, "HDMI Cable (Long)", 1);
   equipment = addItem(equipment, "USB-C Hub", 1);

   // LIGHTING

   // add lighting equipment here

   // SOUND

   equipment = addItem(equipment, "L-12 Mixer", 1);
   equipment = addItem(equipment, "L-12 Mixer Power Cable", 1);

   // if using snake
   equipment = addItem(equipment, "Audio Snake", 1);

   // for Main L/R
   equipment = addItem(equipment, "XLR Cable", 1);
   equipment = addItem(equipment, "XLR Cable (Long)", 1);

   // for wedges
   equipment = addItem(equipment, "XLR-M to 1/4 TRS-M Adapter", 2);
   equipment = addItem(equipment, "Wedge (Active)", 2);
   equipment = addItem(equipment, "XLR Cable", 2);
   equipment = addItem(equipment, "IEC Power Cable", 2);

   // for wireless mics
   const usingWireless = document.querySelector('input[name="use_wireless_mics[]"]').checked;
   if (usingWireless) {
      equipment = addItem(equipment, "Sound Cart", 1);
      equipment = addItem(equipment, "XLR Cable", 2);
   }

   // for Macbook
   const macbookStereo = document.querySelector('input[name="macbook_stereo[]"]').checked;
   if (macbookStereo) {

      const chans = [{ label: "Macbook L" }, { label: "Macbook R" }];
      [equipment, chans[0]] = addItem(equipment, "USB-B to USB-A Adapter", 1, chans[0]);

      channels.push(...chans);

   } else {

      const chans = [{ label: "Macbook" }];
      [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
      [equipment, chans[0]] = addItem(equipment, "DI Box", 1, chans[0]);
      [equipment, chans[0]] = addItem(equipment, "XLR Cable", 1, chans[0]);

      channels.push(...chans);
   }

   return [ channels, equipment ];
}