import React, {Component} from 'react';
import { StyleSheet, Text, FlatList, ListView, View, Platform, Dimensions, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SwipeListView from '../lib';

import generateDates from '../data/TodoDatesGenerator';
import * as TodoActionCreators from '../redux/actions/TodoActionCreators';

import Title from '../components/Title';
import Input from '../components/Input';
import ListRowActive from '../components/ListRowActive';
import DateSelector from '../components/DateSelector';


class ActiveTodosScreen extends Component {

  render() {
    const {dispatch, todosReducer} = this.props;
    const {active} = todosReducer;
    const {todos, editModeIndex} = active;

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let actions = bindActionCreators(TodoActionCreators, dispatch);

    return (
      <View style={styles.container} >
        {Title('My Todo List!')}
        <DateSelector style={styles.date} dates={generateDates()}/>
        <SwipeListView
          dataSource={ds.cloneWithRows(todos)}
          keyExtractor={todo => todo.id}
          extraData={this.props}
          enableEmptySections={true}
          renderRow={( item, secId, rowId ) => (
            <ListRowActive
              todo={{...item}}
              index={rowId}
              {...actions}
            />
          )}
          renderLeftRow={ data => (
    				<View style={styles.rowLeft}>
              <Icon
                 style={styles.icon}
                 name="check" size={20}
               />
    				</View>
    			)}
          renderRightRow={ data => (
    				<View style={styles.rowRight}>
               <Icon
                  style={styles.icon}
                  name="times" size={20}
                />
    				</View>
    			)}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          swipeDuration={200}
          closeOnRowBeginSwipe={true}
          swipeToOpenPercent={40}
          leftOpenValue={Dimensions.get('window').width}
          rightOpenValue={-Dimensions.get('window').width}
          onSwipeLeftComplete={actions.deleteActiveTodo}
          onSwipeRightComplete={(rowId) => {
            actions.completeTodo(rowId);
            actions.deleteActiveTodo(rowId);
          }}
         />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: (Platform.OS === 'ios') ? 20 : 0,
    flex: 1,
    backgroundColor: '#1B2127',
  },
  date: {
    borderRadius: 2,
    borderColor: '#1B2127',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'green'
  },
  rowRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#FE4D33'
  },
  icon: {
    color: 'white',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#182129',
  }
});

const mapStateToProps = (state) => ({
  todosReducer: state.todosReducer,
  nav: state.nav,
})

export default connect(mapStateToProps)(ActiveTodosScreen)
