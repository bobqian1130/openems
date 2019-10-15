import { Component, Input } from '@angular/core';
import { Edge, EdgeConfig, Service, ChannelAddress } from '../../../shared/shared';
import { DefaultTypes } from 'src/app/shared/service/defaulttypes';
import { Cumulated } from 'src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyResponse';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: GridComponent.SELECTOR,
    templateUrl: './grid.component.html'
})
export class GridComponent {

    @Input() public period: DefaultTypes.HistoryPeriod;

    private static readonly SELECTOR = "grid";

    public data: Cumulated = null;
    public values: any;
    public edge: Edge = null;

    constructor(
        public service: Service,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.service.setCurrentComponent('', this.route).then(response => {
            this.edge = response;
        });
    }

    ngOnDestroy() {
    }

    ngOnChanges() {
        this.updateValues();
    };

    updateValues() {
        let channels: ChannelAddress[] = [
            new ChannelAddress('_sum', 'GridBuyActiveEnergy'),
            new ChannelAddress('_sum', 'GridSellActiveEnergy'),
        ];

        this.service.queryEnergy(this.period.from, this.period.to, channels).then(response => {
            this.data = response.result.data;
        }).catch(reason => {
            console.error(reason); // TODO error message
        });
    };
}

