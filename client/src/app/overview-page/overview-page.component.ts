import { Component, OnInit } from '@angular/core';
import {OrganizationsService} from '../shared/services/organizations.service';
import {Observable} from 'rxjs';
import {OrganizationMonthSumm, OrganizationSumm} from '../shared/interfaces';
import {injectTemplateRef} from '@angular/core/src/render3/view_engine_compatibility';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit {

  organizationSumm$: Observable<OrganizationSumm[]>
  allOrganizationSumm = 0
  lastMonthSum = 0
  curr: Observable<any>

  organizationLastMonthSumm$: Observable<OrganizationMonthSumm[]>
  arrayMonth: string [] = []
  arrayOrganization: string [] = []
  arrayResArray: any [] = []
  arrayMonthSum: number [] = []
  // 0 - последний, 1 - больше, 2 - меньше, 3 - равно
  arrayDist: number [] = []

  constructor(private organizationService: OrganizationsService) { }

  ngOnInit() {

    this.organizationSumm$ = this.organizationService.getAllOrganizationSumm()
      console.log(this.organizationSumm$)
    this.getTotalOrganizationSumm()

    this.organizationLastMonthSumm$ = this.organizationService.getLastNumberMonth()
    this.getMyArray()

    // this.curr = this.organizationService.getCurrensy()
    //   this.curr.subscribe(
    //       item => {
    //           console.log(item)
    //       }
    //   )
    //   console.log(this.curr)
    // this.organizationService.getCurrensy().subscribe(
    //     curr => {
    //         console.log(curr)
    //   }
    // )

  }

  private getTotalOrganizationSumm() {
    this.organizationSumm$.subscribe(
        org => {
          org.reduce((total, item) => {
            return this.allOrganizationSumm += item.summa
          }, 0)
        }
    )
  }

  private getMyArray() {
    this.organizationLastMonthSumm$.subscribe(
        item => {
          for(let i = 0; i < item.length; i++) {
            // Search Organization
            if (!this.arrayOrganization.find(p => p === item[i].name)) {
              this.arrayOrganization.push(item[i].name)
            }
            // Search Month
            if (!this.arrayMonth.find(p => p === item[i].month)) {
              this.arrayMonth.push(item[i].month)
            }
          }

          let temparray: any = []
          let idx = 0
          let ids = 0
          for(let i = 0; i < item.length; i++) {
            for(let o = 0; o < this.arrayOrganization.length; o++) {
                temparray = []
                ids = -1
                for(let r = 0; r < this.arrayResArray.length; r++) {
                    if (this.arrayResArray[r][1] === item[i].name) {
                        ids = r
                        break
                    }
                }
                if (ids === -1) {
                    temparray[0] = item[i].id
                    temparray[1] = item[i].name
                    for(let m = 0; m < this.arrayMonth.length; m++) {
                        if (!this.arrayMonth.find(p => p === item[i].month)) {
                            temparray.push(item[i].rub)
                        } else {
                            temparray.push(0)
                        }
                    }
                    this.arrayResArray.push(temparray)
                } else {
                    idx = this.arrayMonth.findIndex(p => p === item[i].month) + 2
                    this.arrayResArray[ids][idx] = item[i].rub
                }
            }
          }
          this.getSumArray()
        }
    )
  }

  private getSumArray() {
      this.arrayMonthSum = []
      this.lastMonthSum = 0
      for(let m = 0; m < this.arrayMonth.length; m++) {
          this.arrayMonthSum.push(0)
          this.arrayDist.push(0)
      }
      for(let r = 0; r < this.arrayResArray.length; r++) {
          for(let s = 0; s < this.arrayMonthSum.length; s++) {
              this.arrayMonthSum[s] += this.arrayResArray[r][s + 2]
              this.lastMonthSum += this.arrayResArray[r][s + 2]
          }
      }
      for(let i = 0; i < this.arrayMonthSum.length - 1; i++) {
          if (this.arrayMonthSum[i] > this.arrayMonthSum[i + 1]) {
              this.arrayDist[i] = 1
              continue
          }
          if (this.arrayMonthSum[i] < this.arrayMonthSum[i + 1]) {
              this.arrayDist[i] = 2
              continue
          }
          if (this.arrayMonthSum[i] === this.arrayMonthSum[i + 1]) {
              this.arrayDist[i] = 3
              continue
          }
      }
  }
}
