export default class ResolutionClass{

    /* This class is responsible for resolving turn submissions in the matches */

    constructor(matchID){
        this.submission=null
        this.matchID = matchID
        this.name = "Resolution"
        console.log("Resolution Phase Start")
    }

    getSubmission(){
        return this.submission;
    }

    setSubmission(input){
        this.submission=input
    }

    clearSubmission(){
        this.submission=null
    }

    turnResolution(input){
        this.setSubmission(input)
        var submissions = this.getSubmission()
        
        for(var i = 0;i<3;i++){
            var player1Submission = submissions.submission1.moves[i]
            var player2Submission = submissions.submission2.moves[i]

            if(player1Submission){
                console.log(player1Submission)
            }
            if(player2Submission){
                console.log(player2Submission)
            }
        }
    }

}