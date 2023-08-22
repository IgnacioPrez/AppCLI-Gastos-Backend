import { Model,Schema ,Types, model } from "mongoose";

export interface IssueData {
    title:string
    description:string
    priority:number
    user:Types.ObjectId
    createdAT:Date
}

const IssueSchema = new Schema<IssueData>({
    title:{
        type:String,
        required:[true,"El titulo es obligatorio"]
    },
    description:{
        type:String,
        required:[true,"La descripción es obligatoria"]
    },
    priority:{
        type:Number,
        required:[true,"La prioridad es obligatoria"]
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdAT:{
        type:Date,
        default:Date.now()
    }
})


export const Issue:Model<IssueData> = model<IssueData>("Issue",IssueSchema) 
