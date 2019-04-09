export default class Submission{

    constructor(sub,uid){
        this.submission={
            submission:sub,
            uid:uid
        }      
    }

    getSubmission(){
        return this.submission
    }

}