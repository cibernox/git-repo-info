'use strict';

var assert = require('assert');
var path = require('path');
var repoInfo = require('../index');

var root = process.cwd();
var testFixturesPath = path.join(__dirname, 'fixtures');
var gitDir = 'dot-git';

describe('git-repo-info', function() {
  before(function() {
    repoInfo._changeGitDir(gitDir);
  });

  afterEach(function() {
    process.chdir(root);
  })

  describe('repo lookup', function() {
    var repoRoot = path.join(testFixturesPath, 'nested-repo');

    it('finds a repo in the current directory', function() {
      process.chdir(repoRoot);

      var foundPath = repoInfo._findRepo(repoRoot);
      assert.equal(foundPath, path.join(repoRoot, gitDir));
    });

    it('finds a repo in the parent directory', function() {
      process.chdir(path.join(repoRoot, 'foo'));

      var foundPath = repoInfo._findRepo(repoRoot);
      assert.equal(foundPath, path.join(repoRoot, gitDir));
    });

    it('finds a repo 2 levels up', function() {
      process.chdir(path.join(repoRoot, 'foo', 'bar'));

      var foundPath = repoInfo._findRepo(repoRoot);
      assert.equal(foundPath, path.join(repoRoot, gitDir));
    });

    it('finds a repo without an argument', function() {
      process.chdir(repoRoot);

      var foundPath = repoInfo._findRepo();
      assert.equal(foundPath, path.join(repoRoot, gitDir));
    });
  });

  describe('repoInfo', function() {
    it('returns an object with repo info', function() {
      var repoRoot = path.join(testFixturesPath, 'nested-repo');
      var result = repoInfo(path.join(repoRoot, gitDir))

      var expected = {
        branch: 'master',
        sha: '5359aabd3872d9ffd160712e9615c5592dfe6745',
        abbreviatedSha: '5359aabd38'
      }

      assert.deepEqual(result, expected);
    });

    it('returns an object with repo info', function() {
      var repoRoot = path.join(testFixturesPath, 'detached-head');
      var result = repoInfo(path.join(repoRoot, gitDir))

      var expected = {
        branch: null,
        sha: '9dac893d5a83c02344d91e79dad8904889aeacb1',
        abbreviatedSha: '9dac893d5a'
      }

      assert.deepEqual(result, expected);
    });
  });
});
