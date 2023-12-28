import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationsList = [
  {
    locationName: 'Hyderabad',
    label: 'Hyderabad',
  },
  {
    locationName: 'Bangalore',
    label: 'Bangalore',
  },
  {
    locationName: 'Chennai',
    label: 'Chennai',
  },
  {
    locationName: 'Delhi',
    label: 'Delhi',
  },
  {
    locationName: 'Mumbai',
    label: 'Mumbai',
  },
]

const apiStatusList = {
  init: 'INIT',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const failureImg = 'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkboxInputs: [],
    locationInputs: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusList.init,
    apiJobsStatus: apiStatusList.init,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusList.loading})

    const token = Cookies.get('jwt_token')
    const profileApi = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(profileApi, options)

    if (response.ok) {
      const data = await response.json()

      if (Array.isArray(data) && data.length > 0) {
        const updatedProfiles = data.map(each => ({
          name: each.profile_details.name,
          profileImageUrl: each.profile_details.profile_image_url,
          shortBio: each.profile_details.short_bio,
        }))

        this.setState({
          profileData: updatedProfiles,
          responseSuccess: true,
          apiStatus: apiStatusList.success,
        })
      } else {
        console.error('No profiles found')
        this.setState({
          apiStatus: apiStatusList.failure,
        })
      }
    } else {
      console.error('Failed to fetch profile data')
      this.setState({
        apiStatus: apiStatusList.failure,
      })
    }
  }

  getJobDetails = async () => {
    this.setState({apiJobsStatus: apiStatusList.loading})
    const token = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const api = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(api, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        id: each.id,
        jobDesc: each.job_description,
        employmentType: each.employment_type,
        location: each.location,
        rating: each.rating,
        title: each.title,
        packagePerAnnum: each.package_per_annum,
      }))
      this.setState({
        jobsData: updatedData,
        apiJobsStatus: apiStatusList.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusList.failure})
    }
  }

  onGetRadioOption = e => {
    this.setState({radioInput: e.target.id}, this.getJobDetails)
  }

  onGetInputOption = e => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(each => each === e.target.id)

    if (inputNotInList.length === 0) {
      this.setState(
        prev => ({
          checkboxInputs: [...prev.checkboxInputs, e.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filteredData = checkboxInputs.filter(each => each !== e.target.id)
      this.setState(
        prev => ({
          checkboxInputs: [...prev.filteredData, filteredData],
        }),
        this.getJobDetails,
      )
    }
  }

  getProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]

      return (
        <div className="profile-container">
          <img src={profileImageUrl} className="profile-icon" alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.getProfileDetails()
  }

  profileFailureView = () => (
    <div className="failure-button-container">
      <button
        className="failure-button"
        type="button"
        onClick={this.onRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="Circles" color="#ob69ff" height="60" width="60" />
    </div>
  )

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusList.success:
        return this.getProfileDetails()
      case apiStatusList.failure:
        return this.getProfileView()
      case apiStatusList.loading:
        return this.renderLoader()

      default:
        return null
    }
  }

  retryJobs = () => {
    this.getJobDetails()
  }

  jobsFailureView = () => (
    <div className="failure-img-button-container">
      <img className="failure-img" src={failureImg} alt="failure view" />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        we cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-button-container">
        <button
          className="failure-button"
          type="button"
          onClick={this.retryJobs}
        >
          Retry
        </button>
      </div>
    </div>
  )

  onGetJobsView = () => {
    const {jobsData, locationInputs} = this.state

    const noJobs = jobsData.length === 0
    let filteredJobs = jobsData

    if (locationInputs.length > 0) {
      filteredJobs = jobsData.filter(job =>
        locationInputs.includes(job.location),
      )
    }

    return noJobs || filteredJobs.length === 0 ? (
      <div className="no-jobs-container">
        <img
          className="no-jobs-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    ) : (
      <ul className="ul-job-items-container">
        {filteredJobs.map(each => (
          <JobItem key={each.id} jobData={each} />
        ))}
      </ul>
    )
  }

  onRenderJobsStatus = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiStatusList.success:
        return this.onGetJobsView()
      case apiStatusList.failure:
        return this.jobsFailureView()
      case apiStatusList.loading:
        return this.renderLoader()

      default:
        return null
    }
  }

  getCheckBoxesView = () => (
    <ul className="check-boxes-container">
      {employmentTypesList.map(each => (
        <li className="li-container" key={each.employmentTypeId}>
          <input
            className="input"
            id={each.employmentTypeId}
            type="checkbox"
            onChange={this.onGetInputOption}
          />
          <label className="label" htmlFor={each.employmentTypeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  getRadioButtonsView = () => (
    <ul className="radio-button-container">
      {salaryRangesList.map(each => (
        <li className="li-container" key={each.salaryRangeId}>
          <input
            className="radio"
            id={each.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onGetRadioOption}
          />
          <label className="label" htmlFor={each.salaryRangeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetLocationOption = e => {
    const {locationInputs} = this.state
    const inputNotInList = locationInputs.filter(each => each === e.target.id)

    if (inputNotInList.length === 0) {
      this.setState(
        prev => ({
          locationInputs: [...prev.locationInputs, e.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filteredData = locationInputs.filter(each => each !== e.target.id)
      this.setState({locationInputs: filteredData}, this.getJobDetails)
    }
  }

  getLocationsView = () => (
    <ul className="check-boxes-container">
      {locationsList.map(each => (
        <li className="li-container" key={each.locationName}>
          <input
            className="input"
            id={each.locationName}
            type="checkbox"
            onChange={this.onGetLocationOption}
          />
          <label className="label" htmlFor={each.locationName}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetSearchInput = e => {
    this.setState({searchInput: e.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobDetails()
  }

  onEnterSearchInput = e => {
    if (e.key === 'Enter') {
      this.getJobDetails()
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="side-bar-container">
            {this.onRenderProfileStatus()}
            <hr className="hr-line" />
            <h1 className="text">Type of Employment</h1>
            {this.getCheckBoxesView()}
            <hr className="hr-line" />
            <h1 className="text">Salary Range</h1>
            {this.getRadioButtonsView()}
            {this.onRenderProfileStatus()}
            <hr className="hr-line" />
            <h1 className="text">Location</h1>
            {this.getLocationsView()}
          </div>
          <div className="jobs-container">
            <div className="search-input-button">
              <input
                className="search-input"
                type="search"
                value={searchInput}
                placeholder="Search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                data-testid="searchButton"
                type="button"
                className="search-button"
                onClick={this.onSubmitSearchInput}
                aria-label="search-icon"
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.onRenderJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
