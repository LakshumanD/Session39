use guvi

db.Users.insertMany([
    {username:"elakkiya",userid:1},
    {username:"lakshman",userid:2},
    {username:"teena",userid:3},
    {username:"nivea",userid:4},
    ]);
    
db.Codekata.insertMany([
    {userid:1,solved:50},
    {userid:2,solved:25},
    {userid:3,solved:75},
    {userid:4,solved:100}
    ])    
    
db.Attendance.insertMany([
        {userid:1,attdate:"10/15/2020",status:"P"},
        {userid:1,attdate:"10/16/2020",status:"A"},
         {userid:1,attdate:"10/17/2020",status:"A"},
        {userid:1,attdate:"10/18/2020",status:"P"},
         {userid:2,attdate:"10/15/2020",status:"P"},
        {userid:2,attdate:"10/16/2020",status:"P"},
         {userid:2,attdate:"10/17/2020",status:"P"},
        {userid:2,attdate:"10/18/2020",status:"P"},
        {userid:3,attdate:"10/15/2020",status:"P"},
        {userid:3,attdate:"10/16/2020",status:"A"},
         {userid:3,attdate:"10/17/2020",status:"A"},
        {userid:4,attdate:"10/18/2020",status:"P"}
        ])
        

    
db.Topics.insertMany([
    {TopicId:1,TopicName:"CSS"},
    {TopicId:2,TopicName:"HTML"},
    {TopicId:3,TopicName:"Bootstrap"},
    {TopicId:4,TopicName:"Javascript"},
    {TopicId:5,TopicName:"MySQL"},
    {TopicId:6,TopicName:"ReactJs"},
    {TopicId:7,TopicName:"NodeJs"},
    {TopicId:8,TopicName:"MongoDB"},
    ])
    
    db.Tasks.insertMany([
    {TopicId:1,TaskName:"Properties",TaskId:1},
    {TopicId:1,TaskName:"Root",TaskId:2},
    {TopicId:2,TaskName:"Tags",TaskId:3},
    {TopicId:2,TaskName:"Events",TaskId:4},
    {TopicId:5,TaskName:"DB Creation",TaskId:5},
    {TopicId:5,TaskName:"CRUD Operations",TaskId:6},
    {TopicId:7,TaskName:"NodeJs Intro",TaskId:7},
    {TopicId:8,TaskName:"MongoDB Intro",TaskId:8},
    ])
    
    db.CompanyDrives.insertMany([
        {id:1,Name:"Agilisium", date:"10/15/2020",Users:[1,2,3,4]},
         {id:2,Name:"Vanamali", date:"10/15/2020",Users:[2,3,1]},
          {id:3,Name:"CTS", date:"10/16/2020",Users:[3,4]},
       {id:4,Name:"Selerant", date:"10/20/2020",Users:[1,3]},
       {id:5,Name:"Kallos", date:"10/22/2020",Users:[4,2,3,1]},
        ])
    
    db.Mentor.insertMany([
        {id:1,Name:"Tamil",Topicid:[1,3,4],CDate:"10/15/2020",usercount:"13"},
        {id:2,Name:"Lavish",Topicid:[2,3],CDate:"10/17/2020",usercount:"19"},
        {id:3,Name:"Lakshuman",Topicid:[6,7,8],CDate:"10/29/2020",usercount:"20"},
        {id:4,Name:"Elakkiya",Topicid:[1,2,4],CDate:"12/10/2020",usercount:"17"},
        {id:5,Name:"Teena",Topicid:[5],CDate:"10/10/2020",usercount:"200"},
        ])
        

//Find all the topics and tasks which are thought in the month of October
db.Mentor.aggregate([
    {"$addFields": {"created_at": {"$toDate": "$CDate"}}}, 
   { $project: {_id:0,Topic:"$Topicid",Month:{$month: "$created_at"}}},
    {$match: {Month:10}},
    {$lookup:
       {
         from: "Topics",
         localField: "Topic",
         foreignField: "TopicId",
         pipeline:[{$project: {_id:0}},
         {$lookup: {
           from: "Tasks",
           localField: "TopicId",
           foreignField: "TopicId",
           pipeline:[{$project: {_id:0}}],
           as: "Tasks"
         }}
         ,{$unwind: {path: "$Topics",
    preserveNullAndEmptyArrays: true}}
     ],
         as: "Topics"
       }
    }
    , {
  $unwind: {
    path: "$Topics",
    preserveNullAndEmptyArrays: true
  }
},
{$project: {Topics:"$Topics.TopicName",Tasks:"$Topics.Tasks.TaskName"} }
   ])
   
 //Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020
db.CompanyDrives.find({$and: [{date:{$gte:"10/15/2020"}},{date:{$lt: "10/31/2020"}}]})

//Find all the company drives and students who are appeared for the placement
db.CompanyDrives.aggregate([
    {$lookup: {
           from: "Users",
           localField: "Users",
           foreignField: "userid",
           as: "Students"
         }}
         ,{$project: {"Company Name":"$Name",
             "Drive Date":"$date",//  {$dateToString: { format: "%Y-%m-%d", date:"$date" }},
             "Students":"$Students.username",_id:0
         }}
    ])

//Find the number of problems solved by the user in codekata
db.Codekata.aggregate([
    {$lookup: {
           from: "Users",
           localField: "userid",
           foreignField: "userid",
           as: "UserName"
         }},
         {$project: {"User Name":{$first:"$UserName.username"},"Problems Solved":"$solved",_id:0}}
    ])
    
    //Find all the mentors with who has the mentee's count more than 15
db.Mentor.find({usercount:{$gt:"15"}})

//Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-202

db.Attendance.find({
        'attdate': { '$gt': '10/15/2020', '$lt': '10/31/2020'},'status':'A'
},{_id:0})