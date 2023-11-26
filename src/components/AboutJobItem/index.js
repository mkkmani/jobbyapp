import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusList = {
  init: 'INIT',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class AboutJobItem extends Component {
  state = {
    jobDataDetails: [],
    similarJobsData: [],
    apiStatus: apiStatusList.init,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusList.loading})

    const token = Cookies.get('jwt_token')
    const api = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    }

    const response = await fetch(api, options)
    if (response.ok) {
      const data = await response.json()

      const updatedData = [data.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDesc: each.job_description,
        lifeAtCompany: {
          desc: each.life_at_company.description,
          imageUrl: each.life_at_company.image_url,
        },
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        skills: each.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: each.title,
      }))

      const updatedSimilarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        id: each.id,
        jobDesc: each.job_description,
        employmentType: each.employment_type,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobDataDetails: updatedData,
        similarJobsData: updatedSimilarJobs,
        apiStatus: apiStatusList.success,
      })
    } else {
      this.setState({apiStatus: apiStatusList.failure})
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jobDataDetails, similarJobsData} = this.state

    if (jobDataDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDesc,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jobDataDetails[0]

      return (
        <div>
          <div className="job-item-container">
            <div className="first-part-container">
              <div className="img-title-container">
                <img
                  className="company-logo"
                  src={companyLogoUrl}
                  alt="job details company logo"
                />
                <div className="title-rating-container">
                  <h1 className="title-heading">{title}</h1>
                  <div className="star-rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating-text">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-package-container">
                <div className="location-job-type-container">
                  <MdLocationOn className="location-icon" />
                  <p className="location">{location}</p>
                </div>
                <div className="employment-type-icon-employment-type-container">
                  <p className="job-type">{employmentType}</p>
                </div>
              </div>
              <div className="package-container">
                <p className="package">{packagePerAnnum}</p>
              </div>
            </div>
          </div>
          <hr className="hr-line" />
          <div className="second-part-container">
            <div className="description-visit-container">
              <h1 className="description-job-heading">Description</h1>
              <a className="visit-anchor" href={companyWebsiteUrl}>
                Visit <BiLinkExternal />
              </a>
            </div>
            <p className="description-para">{jobDesc}</p>
          </div>
          <h1>Skills</h1>
          <ul className="ul-job-details-container">
            {skills.map(each => (
              <li className="li-job-details-container" key={each.name}>
                <img
                  className="skill-img"
                  src={each.imageUrl}
                  alt={each.name}
                />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <div className="company-life-img-container">
            <div className="life-heading-para-container">
              <h1>Life at Company</h1>
              <p>{lifeAtCompany.desc}</p>
            </div>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-ul-container">
            {similarJobsData.map(each => (
              <SimilarJobs
                key={each.id}
                similarJobData={each}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </div>
      )
    }
    return null
  }

  onClickRetry = () => {
    this.getJobData()
  }

  renderJobsFailure = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure-view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for.</p>
      <div className="btn-container-failure">
        <button
          className="failure-job-details-btn"
          type="button"
          onClick={this.onClickRetry}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderLoader = () => (
    <div className="job-details-loader" data-testid="loader">
      <Loader type="RevolvingDot" color="#0b69ff" height="60" width="60" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusList.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusList.failure:
        return this.renderJobsFailure()

      case apiStatusList.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-details-view-container">
          {this.renderJobDetails()}
        </div>
      </div>
    )
  }
}

export default AboutJobItem
