/**
* Test plan for Issue functionality, to be added when the Unit tests (issue #34) are created
* They may require adjustments based on the tools used to create the test suite
*
* For these tests to work, the test unit must have a dummy GitHub account to work with.
* Based on this, no set up is created (only set up required is access to a GitHub repo whle logged in)
* The success criteria will be based on the following variables (may vary depending on the dummy GitHub repo)
* let numberOfIssues = 2;
* let issueNames = ["Test One", "Test Two"];
*
* This test will test the following
* 1. retreiving all issues for a repo and selecting one of these issues
* 2. add an issue and comment on that issue
* 3. add an issue and close the issue
*
* testRetrieveIssuesAndSelectIssue() {
*    try{
*     getIssues(ghrepo);
*     let ul = document.getElementById("issues-panel-dropdown");
*     let issues = ul.getElementsByTagName("li");
*     for (let i = 0; i < issues.length; ++i) {
*         if (issues[i].innerHTML != issueNames[i]) {
*             assert.fail("the issues do not match in the issue panel");
*         }
*     }
*    selectIssue(document.getElementById("0: " + issueNames[0]));
*   }
*   catch (err) {
*        assert.fail(err.meesage);
*   }
* }
* 
* testAddIssueCommentIssue() {
*     let title = "test adding an issue";
*     let body = "body of the issue";
*     createIssue(title, body);
*     assert.equals(title, $('#issueTitle').text());
*     assert.equals(body, $('#issueBody').text());
*
*     let comment = $('#comment-text-area').val("text comment");
*     let id = createIssueComment();
*     assert.equals(comment, $('#' + id).val());
* }
*
* testAddIssueCloseIssue() {
*     let title = "test adding an issue";
*     let body = "body of the issue";
*     createIssue(title, body);
*     assert.equals(title, $('#issueTitle').text());
*     assert.equals(body, $('#issueBody').text());
*
*     closeIssue();
*     assert.equals("No issue chosen", $('#issueTitle').text());
*     assert.equals("", $('#issueBody').text());
* }
* 
*/