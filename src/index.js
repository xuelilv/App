import React, { Component } from 'react';
import {
    Image,
    View,
    FlatList
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import FocusView from './viewPager';

class SectionList extends React.Component {
    render() {
        
    }
}

class PageIndex extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            selectedTab: 'Home'
        };
    }

    render() {
        return (
            <TabNavigator tabBarStyle={styles.tab}>
                <TabNavigator.Item 
                    selected={this.state.selectedTab === 'Home'}
                    title="Home"
                    renderIcon={() => <Image source={require('./assets/images/icon/index.png')} style={styles.image}/>}
                    renderSelectedIcon={() => <Image source={require('./assets/images/icon/index.png')} style={styles.image}/>}
                    onPress={() => this.setState({ selectedTab: 'Home' })}>
                        <View>
                            <FocusView></FocusView>
                        </View>
                </TabNavigator.Item>
            </TabNavigator>
        );
    }
}

const styles = {
    tab: {
        height: 52,
        alignItems: 'center'
    },
    image: {
        width: 26,
        height: 26
    }
};

export default PageIndex;
