export default class Submission{

    constructor(sub,uid,username){
        this.submission={
            submission:sub,
            uid:uid,
            username:username
        }      
    }

    getSubmission(){
        return this.submission
    }

}