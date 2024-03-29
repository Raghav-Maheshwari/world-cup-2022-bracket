import Heading from '@kiwicom/orbit-components/lib/Heading';
import styles from './container.module.css';

export const Container = ({ children, lastUpdatedAt }) => {  
  return (
    <div>
      <div className={styles.title}>
        <Heading>Raghav's&#8482; 2022 World Cup Game</Heading>
      </div>
      <div className={styles.container}>
        {children}
      </div>  
      <div className={styles.timeStamp}>Last updated: {lastUpdatedAt}</div>
    </div>
  )
}