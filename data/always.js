function equipAlways(channels, equipment) {

   // Sean or Josh: could you add the equipment we need every time with the following syntax:
   // equipment["Item Name"]++; <-- to add one
   // equipment["Item Name"] += 2; <-- to add multiple
   // item names should correspond to inventory.js

   // POWER

   // PROJECTION

   // LIGHTING

   // SOUND

   // if using snake
   equipment["Snake"] = 1;

   // for Main L/R
   equipment["XLR"]++; 
   equipment["XLR (Long)"]++;

   // for wedges
   equipment["Wedge"] = 2;
   equipment["XLR"] += 2;
   equipment["Power Cable"] += 2;

   // for Macbook
   channels += 2;

   return [ channels, equipment ];
}