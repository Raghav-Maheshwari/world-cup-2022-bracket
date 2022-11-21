import styles from '../components/container.module.css'

export default function Index() {
  return (
    <div className={styles.videoContainer}>
      <iframe src="https://www.youtube.com/embed/ni6ngHlI1_Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  )
}