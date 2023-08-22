import { Request, Response } from 'express'
import { IssueData,Issue } from '../model/issue'
import { ObjectId } from 'mongoose'

export const newIssue = async (req:Request,res:Response) :Promise<void> => {
    const {title,description,priority}: IssueData = req.body

    const user:ObjectId = req.body.userConfirmed._id

    const newIssueData = {
        title,
        description,
        priority,
        user,
        createdAT: new Date()
    }
    const issue = new Issue(newIssueData)

    await issue.save()
    res.status(201).json({
        issue
    })
}
