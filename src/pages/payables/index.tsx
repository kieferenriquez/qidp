import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Grid, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function Payables() {
  return (
    <>
      <main className={styles.main}>
        <Grid templateColumns="1fr 1fr" templateRows="10rem 10rem" gap="10rem">
          <View>
            <p>Test</p>
          </View>
          <View>
            <p>test</p>
          </View>
        </Grid>
      </main>
    </>
  );
}

export default Payables;
