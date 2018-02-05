import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    FlatList
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import FocusView from './viewPager';

class SectionList extends React.Component {
    render() {
        return (
            <View style={styles.scene}>
                <FocusView />
                <FlatList
                data={[{key: 'a'}, {key: 'b'}]}
                renderItem={({item}) => <Text>{item.key}</Text>}
                />
            </View>
        );
        
        
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
                        {<SectionList />}
                </TabNavigator.Item>
                <TabNavigator.Item 
                    selected={this.state.selectedTab === 'Setting'}
                    title="Setting"
                    renderIcon={() => <Image source={require('./assets/images/icon/settle_setting.png')} style={styles.image}/>}
                    renderSelectedIcon={() => <Image source={require('./assets/images/icon/settle_setting.png')} style={styles.image}/>}
                    onPress={() => this.setState({ selectedTab: 'Setting' })}>
                        {<SectionList />}
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
    },
    scene: {
        position: 'absolute',
        top: 0,
        bottom: 52
    }
};

export default PageIndex;
