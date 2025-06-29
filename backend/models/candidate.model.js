const mongoose =require('mongoose');
const  candidateSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    party:{
        type: String,
        required:true
    },
    age:{
        type: Number,
        required:true
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    votes:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        votingTime:{
            type:Date,
            default:Date.now()
        }
    }],
    voteCount:{
        type:Number,
        default:0
    }
});
const Candidate=mongoose.model('Candidate',candidateSchema);
module.exports=Candidate;





