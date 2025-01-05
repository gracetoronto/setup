function equipAlways(channels, equipment) {

   // Sean or Josh – could you add the equipment we need every time with the following syntax:
   // equipment = addItem(equipment, "Item Name", quantity);

   // to add one: equipment = addItem(equipment, "Item Name", 1);
   // to add three: equipment = addItem(equipment, "Item Name", 1);
   // item names should correspond to inventory.js

   // POWER

   // PROJECTION

   // LIGHTING

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

   // for Macbook
   const checkboxMacbookStereo = document.querySelector('input[name="macbook_stereo[]"]');
   
   if (checkboxMacbookStereo.checked) {

      // add equipment

      channels.push({ label: "Macbook L" }, { label: "Macbook R" });
   } else {

      // add equipment

      channels.push({ label: "Macbook" });
   }

   return [ channels, equipment ];
}