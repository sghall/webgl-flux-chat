/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var ChatConstants = require('../constants/ChatConstants');
var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

var PayloadSources = {view: 'VIEW_ACTION', server: 'SERVER_ACTION'};
 

var ChatAppDispatcher = SubUnit.createDispatcher();

ChatAppDispatcher.handleServerAction = function (action) {
  var payload = {
    source: PayloadSources.server,
    action: action
  };
  this.dispatch(payload);
};

ChatAppDispatcher.handleViewAction = function (action) {
  var payload = {
    source: PayloadSources.view,
    action: action
  };
  this.dispatch(payload);
}


module.exports = ChatAppDispatcher;
