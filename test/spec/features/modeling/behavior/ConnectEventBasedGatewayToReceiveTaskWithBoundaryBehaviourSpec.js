import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'lib/features/modeling';
import coreModule from 'lib/core';


describe('features/modeling/behavior - remove boundary event after event based gateway', function() {

  var testModules = [ coreModule, modelingModule ];

  var diagramXML = require('./ConnectEventBasedGatewayToReceiveTaskWithBoundaryBehaviour.bpmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules.concat(modelingModule) }));


  it('should remove the boundary event from the receive task after connecting the task with an event based gateway',
    inject(function(modeling, elementRegistry, elementFactory) {

    // given
      var eventBasedGateway = elementRegistry.get('EventBasedGateway_1'),
          receiveTask = elementRegistry.get('ReceiveTask_1'),
          boundaryEvent = elementRegistry.get('BoundaryEvent_1');

      // when
      modeling.connect(eventBasedGateway, receiveTask, {
        type: 'bpmn:SequenceFlow'
      });

      // then
      expect(elementRegistry.get(boundaryEvent.id)).to.be.undefined;
    }));

});