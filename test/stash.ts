/**
 * TEST PLAN FOR STASHING AND APPLYING FUNCTIONALITY
 * 
 * The following is a test plan for the stash and applying (and deleting) functionality.
 * This test plan is made temporarily until a test suite is created, in which these tests should be integrated in.
 * To compensate for the lack of tests, the following functionalities have been smoke tested and observed for correct behaviour.
 * 
 * 1.1 Purpose of test plan
 * The purpose of this test plan is to test the stashing, applying and deleting functionality for modified changes.
 * 
 * 1.2 Test approaches
 * The following are an outline of the tests
 * 
 * SetUp() {
 *  import { stashChanges } from ../app/misc/git.ts
 *  import { applyStashedChanges } from ../app/misc/git.ts
 * 
 *  var testRepository = new Repository();
 *  var fileName = "TEST_FILE.txt";
 *  var fileContent = "This is some added content";
 *  var textFile = new File(fileName);
 * 
 *  textFile.writeln(fileContent);
 * }
 * 
 * 
 * //--- Stash functionality ----//
 * stashFile(){
 *  stashChanges();
 *  Git.Stash.foreach(repository, (function(key,value) {
 *    stashes.push(value);
 *  }), {}).
 *  .then(function() {
 *    assert.equals(stashes.length, 1);
 *    assert.equal(stashes[0].index, 0);
 *  });
 * }
 * 
 * 
 * //--- View Stash ----//
 * viewStashedFile(){
 *  stashChanges();
 *  var viewedStashes = getStashList();
 *  assert.equals(viewedStashes.size, 1);
 *  assert.equals(viewedStashes.values()[0], 0);
 * }
 * 
 * 
 * //--- Applying Stash Functionality ---//
 * applyStashOnFile() {
 *  stashChanges();
 *  applyStashedChanges();
 * 
 *  assert.equals(fileName.readTextFile(), fileContent);
 *  Git.Stash.foreach(repository, (function(key,value) {
 *    stashes.push(value);
 *  }), {}).
 *  .then(function() {
 *    assert.equals(stashes.length, 1);
 *    assert.equal(stashes[0].index, 0);
 *  });
 * }
 * 
 * 
 * //--- Deleting Stash Functionality ---//
 * deleteStashOnFile() {
 *  stashChanges();
 *  deleteStash();
 * 
 *  Git.Stash.foreach(repository, (function(key,value) {
 *    stashes.push(value);
 *  }), {}).
 *  .then(function() {
 *    assert.equals(stashes.length, 0);
 *  });
 * }
 * 
 * 
 * //--- Merge Conflict With Stash ---//
 * conflictWhenApplying() {
 *  var errorMessage = "Oops, there are conflicts while trying to apply your stash. Please resolve these (discard your changes)."
 *  stashChanges();
 *  applyStashedChanges();
 *  applyStashedChanges();
 * 
 *  assert.equals(getModalText(), errorMessage);
 * }
 */