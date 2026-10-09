export const moduleConfig = {
  bookings:{title:"Bookings",singular:"Booking",icon:"flight_takeoff",description:"Manage end-to-end travel bookings.",fields:[
    {key:"bookingNo",label:"Booking number",type:"text",required:true,placeholder:"BK-00001"},
    {key:"customerId",label:"Customer",type:"select",source:"customers",required:true,display:"name"},
    {key:"travellerId",label:"Traveller",type:"select",source:"travellers",required:true,display:"name"},
    {key:"branchId",label:"Branch",type:"select",options:[["DUBAI","Dubai · UAE"],["INDIA","India"]],required:true},
    {key:"bookingType",label:"Booking type",type:"select",options:[["Flight","Flight"],["Hotel","Hotel"],["Flight + Hotel","Flight + Hotel"],["Visa","Visa"],["Transport","Transport"],["Package","Tour package"]],required:true},
    {key:"origin",label:"Origin",type:"text",required:true},{key:"destination",label:"Destination",type:"text",required:true},
    {key:"departureDate",label:"Departure date",type:"date",required:true},{key:"returnDate",label:"Return date",type:"date"},
    {key:"currency",label:"Currency",type:"select",options:[["AED","AED"],["INR","INR"],["USD","USD"]],required:true},
    {key:"amount",label:"Total amount",type:"number",required:true},{key:"status",label:"Status",type:"select",options:[["Requested","Requested"],["Pending","Pending approval"],["Confirmed","Confirmed"],["Completed","Completed"],["Cancelled","Cancelled"]],required:true},
    {key:"notes",label:"Notes",type:"textarea",full:true}
  ]},
  customers:{title:"Customers",singular:"Customer",icon:"groups",description:"Customer records linked to bookings and invoices.",fields:[
    {key:"customerNo",label:"Customer ID",type:"text",required:true,placeholder:"CUS-00001"},{key:"name",label:"Customer / company name",type:"text",required:true},
    {key:"customerType",label:"Customer type",type:"select",options:[["Individual","Individual"],["Corporate","Corporate"],["Agent","Travel agent"]],required:true},
    {key:"phone",label:"Phone",type:"tel"},{key:"email",label:"Email",type:"email"},{key:"branchId",label:"Primary branch",type:"select",options:[["DUBAI","Dubai · UAE"],["INDIA","India"]],required:true},
    {key:"country",label:"Country",type:"text"},{key:"taxNumber",label:"Tax / TRN / GSTIN",type:"text"},{key:"address",label:"Address",type:"textarea",full:true}
  ]},
  travellers:{title:"Travellers",singular:"Traveller",icon:"luggage",description:"Traveller profiles and travel document references.",fields:[
    {key:"travellerNo",label:"Traveller ID",type:"text",required:true,placeholder:"TRV-00001"},{key:"name",label:"Full name",type:"text",required:true},
    {key:"customerId",label:"Customer",type:"select",source:"customers",required:true,display:"name"},{key:"branchId",label:"Branch",type:"select",options:[["DUBAI","Dubai · UAE"],["INDIA","India"]],required:true},
    {key:"email",label:"Email",type:"email"},{key:"phone",label:"Phone",type:"tel"},{key:"passportNo",label:"Passport number",type:"text"},{key:"passportExpiry",label:"Passport expiry",type:"date"},
    {key:"nationality",label:"Nationality",type:"text"},{key:"dateOfBirth",label:"Date of birth",type:"date"}
  ]},
  flights:{title:"Flights",singular:"Flight record",icon:"flight",description:"Flight sectors linked to bookings and travellers.",fields:[
    {key:"flightNo",label:"Flight record ID",type:"text",required:true,placeholder:"FLT-00001"},{key:"bookingId",label:"Booking",type:"select",source:"bookings",required:true,display:"bookingNo"},
    {key:"airline",label:"Airline",type:"text",required:true},{key:"flightNumber",label:"Flight number",type:"text"},{key:"pnr",label:"PNR / reference",type:"text"},
    {key:"origin",label:"From airport / city",type:"text",required:true},{key:"destination",label:"To airport / city",type:"text",required:true},
    {key:"departureDate",label:"Departure",type:"datetime-local",required:true},{key:"arrivalDate",label:"Arrival",type:"datetime-local"},
    {key:"ticketStatus",label:"Ticket status",type:"select",options:[["On hold","On hold"],["Ticketed","Ticketed"],["Flown","Flown"],["Cancelled","Cancelled"]],required:true},
    {key:"amount",label:"Ticket cost",type:"number"},{key:"currency",label:"Currency",type:"select",options:[["AED","AED"],["INR","INR"],["USD","USD"]]}
  ]},
  hotels:{title:"Hotels",singular:"Hotel reservation",icon:"hotel",description:"Hotel stays connected to customers, travellers and bookings.",fields:[
    {key:"hotelRef",label:"Hotel record ID",type:"text",required:true,placeholder:"HTL-00001"},{key:"bookingId",label:"Booking",type:"select",source:"bookings",required:true,display:"bookingNo"},
    {key:"hotelName",label:"Hotel name",type:"text",required:true},{key:"city",label:"City",type:"text",required:true},{key:"country",label:"Country",type:"text"},
    {key:"checkIn",label:"Check-in",type:"date",required:true},{key:"checkOut",label:"Check-out",type:"date",required:true},{key:"roomType",label:"Room type",type:"text"},
    {key:"confirmationNo",label:"Confirmation number",type:"text"},{key:"amount",label:"Total cost",type:"number"},{key:"currency",label:"Currency",type:"select",options:[["AED","AED"],["INR","INR"],["USD","USD"]]},
    {key:"status",label:"Status",type:"select",options:[["Requested","Requested"],["Confirmed","Confirmed"],["Checked in","Checked in"],["Completed","Completed"],["Cancelled","Cancelled"]]}
  ]},
  visa:{title:"Visa management",singular:"Visa application",icon:"contact_pass",description:"Track visa applications, document status and validity.",fields:[
    {key:"visaNo",label:"Application ID",type:"text",required:true,placeholder:"VISA-00001"},{key:"travellerId",label:"Traveller",type:"select",source:"travellers",required:true,display:"name"},
    {key:"bookingId",label:"Related booking",type:"select",source:"bookings",display:"bookingNo"},{key:"branchId",label:"Branch",type:"select",options:[["DUBAI","Dubai · UAE"],["INDIA","India"]],required:true},
    {key:"destinationCountry",label:"Destination country",type:"text",required:true},{key:"visaType",label:"Visa type",type:"select",options:[["Tourist","Tourist"],["Business","Business"],["Transit","Transit"],["Visit","Visit"],["Employment","Employment"],["Other","Other"]],required:true},
    {key:"submittedDate",label:"Submitted date",type:"date"},{key:"validFrom",label:"Valid from",type:"date"},{key:"validUntil",label:"Valid until",type:"date"},
    {key:"status",label:"Application status",type:"select",options:[["Documents pending","Documents pending"],["Submitted","Submitted"],["Under process","Under process"],["Approved","Approved"],["Rejected","Rejected"],["Expired","Expired"]],required:true},
    {key:"fee",label:"Visa fee",type:"number"},{key:"currency",label:"Currency",type:"select",options:[["AED","AED"],["INR","INR"],["USD","USD"]]},
    {key:"notes",label:"Notes",type:"textarea",full:true}
  ]},
  transport:{title:"Transport",singular:"Transport booking",icon:"airport_shuttle",description:"Airport transfers, cars, drivers and ground transportation.",fields:[
    {key:"transportNo",label:"Transport ID",type:"text",required:true,placeholder:"TRN-00001"},{key:"bookingId",label:"Booking",type:"select",source:"bookings",required:true,display:"bookingNo"},
    {key:"provider",label:"Provider",type:"select",source:"suppliers",display:"name"},{key:"vehicleType",label:"Vehicle type",type:"select",options:[["Sedan","Sedan"],["SUV","SUV"],["Van","Van"],["Bus","Bus"],["Other","Other"]]},
    {key:"pickup",label:"Pickup location",type:"text",required:true},{key:"dropoff",label:"Drop-off location",type:"text",required:true},
    {key:"pickupDate",label:"Pickup date/time",type:"datetime-local",required:true},{key:"driver",label:"Driver / contact",type:"text"},
    {key:"amount",label:"Cost",type:"number"},{key:"currency",label:"Currency",type:"select",options:[["AED","AED"],["INR","INR"],["USD","USD"]]},
    {key:"status",label:"Status",type:"select",options:[["Requested","Requested"],["Confirmed","Confirmed"],["Completed","Completed"],["Cancelled","Cancelled"]]}
  ]},
  suppliers:{title:"Suppliers",singular:"Supplier",icon:"business",description:"Airlines, hotels, transport providers and travel partners.",fields:[
    {key:"supplierNo",label:"Supplier ID",type:"text",required:true,placeholder:"SUP-00001"},{key:"name",label:"Supplier name",type:"text",required:true},
    {key:"category",label:"Category",type:"select",options:[["Airline","Airline"],["Hotel","Hotel"],["Transport","Transport"],["Visa service","Visa service"],["Tour operator","Tour operator"],["Other","Other"]],required:true},
    {key:"branchId",label:"Branch",type:"select",options:[["DUBAI","Dubai · UAE"],["INDIA","India"],["BOTH","Both branches"]],required:true},
    {key:"contact",label:"Contact person",type:"text"},{key:"phone",label:"Phone",type:"tel"},{key:"email",label:"Email",type:"email"},{key:"currency",label:"Settlement currency",type:"select",options:[["AED","AED"],["INR","INR"],["USD","USD"]]},
    {key:"paymentTerms",label:"Payment terms",type:"text"},{key:"notes",label:"Notes",type:"textarea",full:true}
  ]},
  invoices:{title:"Invoices",singular:"Invoice",icon:"request_quote",description:"Issue customer invoices linked to bookings and record balances.",fields:[
    {key:"invoiceNo",label:"Invoice number",type:"text",required:true,placeholder:"INV-00001"},{key:"customerId",label:"Customer",type:"select",source:"customers",required:true,display:"name"},
    {key:"bookingId",label:"Booking",type:"select",source:"bookings",required:true,display:"bookingNo"},{key:"branchId",label:"Branch",type:"select",options:[["DUBAI","Dubai · UAE"],["INDIA","India"]],required:true},
    {key:"invoiceDate",label:"Invoice date",type:"date",required:true},{key:"dueDate",label:"Due date",type:"date"},
    {key:"currency",label:"Currency",type:"select",options:[["AED","AED"],["INR","INR"],["USD","USD"]],required:true},{key:"subtotal",label:"Subtotal",type:"number",required:true},
    {key:"taxAmount",label:"Tax amount",type:"number"},{key:"status",label:"Status",type:"select",options:[["Draft","Draft"],["Issued","Issued"],["Part paid","Part paid"],["Paid","Paid"],["Overdue","Overdue"],["Cancelled","Cancelled"]],required:true},
    {key:"notes",label:"Notes",type:"textarea",full:true}
  ]},
  payments:{title:"Payments",singular:"Payment",icon:"payments",description:"Record receipts and allocate payments against invoices.",fields:[
    {key:"paymentNo",label:"Payment ID",type:"text",required:true,placeholder:"PAY-00001"},{key:"invoiceId",label:"Invoice",type:"select",source:"invoices",required:true,display:"invoiceNo"},
    {key:"customerId",label:"Customer",type:"select",source:"customers",required:true,display:"name"},{key:"paymentDate",label:"Payment date",type:"date",required:true},
    {key:"amount",label:"Amount received",type:"number",required:true},{key:"currency",label:"Currency",type:"select",options:[["AED","AED"],["INR","INR"],["USD","USD"]],required:true},
    {key:"method",label:"Payment method",type:"select",options:[["Bank transfer","Bank transfer"],["Card","Card"],["Cash","Cash"],["UPI","UPI"],["Payment link","Payment link"],["Other","Other"]],required:true},
    {key:"reference",label:"Transaction reference",type:"text"},{key:"status",label:"Status",type:"select",options:[["Received","Received"],["Pending","Pending"],["Failed","Failed"],["Refunded","Refunded"]],required:true}
  ]},
  expenses:{title:"Expenses",singular:"Expense",icon:"receipt_long",description:"Track operating costs and trip-related expenses by branch.",fields:[
    {key:"expenseNo",label:"Expense ID",type:"text",required:true,placeholder:"EXP-00001"},{key:"branchId",label:"Branch",type:"select",options:[["DUBAI","Dubai · UAE"],["INDIA","India"]],required:true},
    {key:"bookingId",label:"Related booking",type:"select",source:"bookings",display:"bookingNo"},{key:"supplierId",label:"Supplier",type:"select",source:"suppliers",display:"name"},
    {key:"category",label:"Category",type:"select",options:[["Air tickets","Air tickets"],["Hotel","Hotel"],["Transport","Transport"],["Visa","Visa"],["Meals","Meals"],["Office","Office"],["Other","Other"]],required:true},
    {key:"expenseDate",label:"Expense date",type:"date",required:true},{key:"description",label:"Description",type:"text",required:true},
    {key:"currency",label:"Currency",type:"select",options:[["AED","AED"],["INR","INR"],["USD","USD"]],required:true},{key:"amount",label:"Amount",type:"number",required:true},
    {key:"status",label:"Approval status",type:"select",options:[["Pending","Pending"],["Approved","Approved"],["Rejected","Rejected"],["Reimbursed","Reimbursed"]],required:true}
  ]},
  employees:{title:"Employees",singular:"Employee",icon:"badge",description:"Manage staff profiles and branch assignments.",fields:[
    {key:"employeeNo",label:"Employee ID",type:"text",required:true,placeholder:"EMP-00001"},{key:"name",label:"Full name",type:"text",required:true},
    {key:"branchId",label:"Branch",type:"select",options:[["DUBAI","Dubai · UAE"],["INDIA","India"]],required:true},{key:"department",label:"Department",type:"select",options:[["Management","Management"],["Sales","Sales"],["Operations","Operations"],["Finance","Finance"],["Visa","Visa"],["Support","Support"],["IT","IT"]]},
    {key:"role",label:"Role",type:"select",options:[["Admin","Admin"],["Manager","Manager"],["Agent","Agent"],["Finance","Finance"],["Viewer","Viewer"]],required:true},
    {key:"email",label:"Work email",type:"email"},{key:"phone",label:"Phone",type:"tel"},{key:"status",label:"Status",type:"select",options:[["Active","Active"],["Inactive","Inactive"]],required:true}
  ]}
};
export const seedData = {
 customers:[
  {id:"cus1",customerNo:"CUS-00001",name:"Al Noor Trading LLC",customerType:"Corporate",phone:"+971 50 123 4567",email:"travel@alnoor.example",branchId:"DUBAI",country:"UAE",taxNumber:"TRN demo"},
  {id:"cus2",customerNo:"CUS-00002",name:"Malabar Business Services",customerType:"Corporate",phone:"+91 98470 12345",email:"admin@malabar.example",branchId:"INDIA",country:"India",taxNumber:"GST demo"},
  {id:"cus3",customerNo:"CUS-00003",name:"Aisha Rahman",customerType:"Individual",phone:"+971 55 555 0101",email:"aisha@example.com",branchId:"DUBAI",country:"UAE"}
 ],
 travellers:[
  {id:"trv1",travellerNo:"TRV-00001",name:"Arjun Menon",customerId:"cus2",branchId:"INDIA",email:"arjun@example.com",phone:"+91 98470 00001",passportNo:"DEMO12345",nationality:"Indian"},
  {id:"trv2",travellerNo:"TRV-00002",name:"Priya Nair",customerId:"cus2",branchId:"INDIA",email:"priya@example.com",phone:"+91 98470 00002",passportNo:"DEMO23456",nationality:"Indian"},
  {id:"trv3",travellerNo:"TRV-00003",name:"Mohammed Ali",customerId:"cus1",branchId:"DUBAI",email:"m.ali@example.com",phone:"+971 50 000 0003",passportNo:"DEMO34567",nationality:"Indian"}
 ],
 bookings:[
  {id:"bk1",bookingNo:"BK-00001",customerId:"cus1",travellerId:"trv3",branchId:"DUBAI",bookingType:"Flight",origin:"Dubai",destination:"Kochi",departureDate:"2026-10-12",returnDate:"2026-10-19",currency:"AED",amount:1450,status:"Confirmed",notes:"Demo record"},
  {id:"bk2",bookingNo:"BK-00002",customerId:"cus2",travellerId:"trv1",branchId:"INDIA",bookingType:"Flight + Hotel",origin:"Kochi",destination:"Dubai",departureDate:"2026-10-14",returnDate:"2026-10-20",currency:"INR",amount:48500,status:"Pending",notes:"Demo record"},
  {id:"bk3",bookingNo:"BK-00003",customerId:"cus1",travellerId:"trv3",branchId:"DUBAI",bookingType:"Transport",origin:"Dubai Airport",destination:"Abu Dhabi",departureDate:"2026-10-17",currency:"AED",amount:320,status:"Requested",notes:"Demo record"},
  {id:"bk4",bookingNo:"BK-00004",customerId:"cus2",travellerId:"trv2",branchId:"INDIA",bookingType:"Visa",origin:"Kochi",destination:"Mumbai",departureDate:"2026-10-18",currency:"INR",amount:8500,status:"Confirmed",notes:"Demo record"}
 ],
 flights:[{id:"flt1",flightNo:"FLT-00001",bookingId:"bk1",airline:"Demo Airways",flightNumber:"DA 201",pnr:"DEMO01",origin:"DXB",destination:"COK",departureDate:"2026-10-12T09:30",arrivalDate:"2026-10-12T15:00",ticketStatus:"Ticketed",amount:1450,currency:"AED"}],
 hotels:[{id:"htl1",hotelRef:"HTL-00001",bookingId:"bk2",hotelName:"City Centre Demo Hotel",city:"Dubai",country:"UAE",checkIn:"2026-10-14",checkOut:"2026-10-20",roomType:"Standard",confirmationNo:"HTLDEMO01",amount:1200,currency:"AED",status:"Confirmed"}],
 visa:[{id:"visa1",visaNo:"VISA-00001",travellerId:"trv1",bookingId:"bk4",branchId:"INDIA",destinationCountry:"UAE",visaType:"Tourist",submittedDate:"2026-10-01",status:"Under process",fee:8500,currency:"INR",notes:"Demo record"}],
 transport:[{id:"trans1",transportNo:"TRN-00001",bookingId:"bk3",provider:"",vehicleType:"Sedan",pickup:"Dubai Airport",dropoff:"Abu Dhabi",pickupDate:"2026-10-17T10:00",driver:"Demo driver",amount:320,currency:"AED",status:"Confirmed"}],
 suppliers:[{id:"sup1",supplierNo:"SUP-00001",name:"Demo Airways",category:"Airline",branchId:"BOTH",contact:"Sales desk",phone:"+971 4 000 0000",email:"sales@example.com",currency:"AED",paymentTerms:"15 days"},{id:"sup2",supplierNo:"SUP-00002",name:"City Centre Demo Hotel",category:"Hotel",branchId:"DUBAI",contact:"Reservations",phone:"+971 4 000 0001",email:"reservations@example.com",currency:"AED",paymentTerms:"On checkout"}],
 invoices:[{id:"inv1",invoiceNo:"INV-00001",customerId:"cus1",bookingId:"bk1",branchId:"DUBAI",invoiceDate:"2026-10-09",dueDate:"2026-10-16",currency:"AED",subtotal:1450,taxAmount:72.5,status:"Issued",notes:"Demo invoice"}],
 payments:[{id:"pay1",paymentNo:"PAY-00001",invoiceId:"inv1",customerId:"cus1",paymentDate:"2026-10-09",amount:500,currency:"AED",method:"Bank transfer",reference:"DEMO-REF-001",status:"Received"}],
 expenses:[{id:"exp1",expenseNo:"EXP-00001",branchId:"DUBAI",bookingId:"bk1",supplierId:"sup1",category:"Air tickets",expenseDate:"2026-10-09",description:"Sample ticket supplier cost",currency:"AED",amount:1000,status:"Approved"},{id:"exp2",expenseNo:"EXP-00002",branchId:"INDIA",bookingId:"bk2",supplierId:"sup2",category:"Hotel",expenseDate:"2026-10-09",description:"Sample hotel expense",currency:"INR",amount:20000,status:"Pending"}],
 employees:[{id:"emp1",employeeNo:"EMP-00001",name:"Demo Administrator",branchId:"DUBAI",department:"Management",role:"Admin",email:"admin@example.com",phone:"+971 50 000 0000",status:"Active"},{id:"emp2",employeeNo:"EMP-00002",name:"India Operations",branchId:"INDIA",department:"Operations",role:"Manager",email:"india@example.com",phone:"+91 98470 00000",status:"Active"}]
};
