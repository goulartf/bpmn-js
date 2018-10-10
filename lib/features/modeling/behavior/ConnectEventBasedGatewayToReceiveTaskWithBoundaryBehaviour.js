import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from '../../../util/ModelUtil';

import {
  filter
} from 'min-dash';


/**
 * Behavior for deleting boundaries from receive task after connecting them with event based gateway
 */
export default function ConnectEventBasedGatewayToReceiveTaskWithBoundaryBehaviour(
    eventBus, modeling, bpmnRules) {

  CommandInterceptor.call(this, eventBus);

  function extractBoundaryEvents(element) {
    return filter(element.attachers, function(attacher) {
      return is(attacher, 'bpmn:BoundaryEvent');
    });
  }

  function isReceiveTaskWithBoundary(element) {
    return (
      is(element, 'bpmn:ReceiveTask') &&
      extractBoundaryEvents(element).length > 0
    );
  }

  this.postExecute('connection.create', function(context) {
    var source = context.context.source,
        target = context.context.target;

    if (is(source, 'bpmn:EventBasedGateway') &&
        isReceiveTaskWithBoundary(target)) {
      modeling.removeElements(extractBoundaryEvents(target));
    }

  });
}

ConnectEventBasedGatewayToReceiveTaskWithBoundaryBehaviour.$inject = [
  'eventBus',
  'modeling',
  'bpmnRules'
];

inherits(ConnectEventBasedGatewayToReceiveTaskWithBoundaryBehaviour, CommandInterceptor);
